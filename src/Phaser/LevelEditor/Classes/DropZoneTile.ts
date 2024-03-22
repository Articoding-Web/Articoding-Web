import * as Phaser from 'phaser';
import LevelEditor from '../LevelEditor';
import config from '../../../config';

export default class DropZoneTile extends Phaser.GameObjects.Zone {
  //owned sprite:
  private bgSprite: Phaser.GameObjects.Sprite | undefined;
  //owned object:
  private objectSprite: Phaser.GameObjects.Sprite | undefined;

  constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
    super(scene, x, y, width, height);

    this.setRectangleDropZone(width, height);

    const graphics = this.scene.add.graphics();
    graphics.lineStyle(2, 0xffff00);
    graphics.strokeRect(this.x - this.input.hitArea.width / 2, this.y - this.input.hitArea.height / 2, this.input.hitArea.width, this.input.hitArea.height);

    this.scene.add.existing(this);

    this.on("pointerdown", this.clickEvent);
    this.on('pointerover', this.pointerOverEvent);
  }

  pointerOverEvent(pointer: Phaser.Input.Pointer) {
    if(pointer.leftButtonDown())
      this.clickEvent();
  }

  clickEvent() {
    const selectedTool = (<HTMLInputElement>(document.querySelector('input[name="editor-tool"]:checked'))).id;
    if(selectedTool === "paintbrush") {
      this.paintIcon();
    } else {
      this.deleteIcon();
    }
  }

  paintIcon() {
    const icon = (<LevelEditor>(this.scene)).getSelectedIcon();
    if(icon.texture === undefined)
      return;

    const scaleFactor = this.width / config.TILE_SIZE;
    const sprite = this.scene.add.sprite(this.x, this.y, icon.texture, icon.frame);
    sprite.setScale(scaleFactor);

    if(icon.texture === "background") {
      this.setBgSprite(sprite);
    } else {
      this.setObjectSprite(sprite);
    }
  }

  deleteIcon() {
    if(this.objectSprite) {
      this.objectSprite.destroy(true);
      this.objectSprite = undefined;
    } else {
      this.bgSprite?.destroy(true);
      this.bgSprite = undefined;
    }
  }

  resize(x: number, y: number, width: number, height: number) {
    this.setPosition(x, y);
    this.setSize(width, height);
    //setRectangleDropZone tal vez de error
    this.setRectangleDropZone(width, height);
  }

  getBgSprite(): Phaser.GameObjects.Sprite {
    return this.bgSprite;
  }

  contains(x: number, y: number): boolean {
    const left = this.x;
    const right = this.x + this.width;
    const top = this.y;
    const bottom = this.y + this.height;

    return x >= left && x <= right && y >= top && y <= bottom;
  }

  getObjectSprite(): Phaser.GameObjects.Sprite {
    return this.objectSprite;
  }

  private setObjectSprite(sprite: Phaser.GameObjects.Sprite) {
    this.objectSprite?.destroy(true);

    if (this.bgSprite !== undefined) {
      // Create duplicate sprite only if has background
      this.objectSprite = sprite;
    } else {
      // Destroy sprite
      sprite.destroy(true);
    }
  }

  private setBgSprite(sprite: Phaser.GameObjects.Sprite) {
    this.bgSprite?.destroy(true); // destroy if existed
    this.bgSprite = sprite;
  }
}