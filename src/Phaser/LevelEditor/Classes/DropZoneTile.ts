import * as Phaser from 'phaser'
import ArticodingObject from './ArticodingObject';
import LevelEditor from '../LevelEditor';
import config from '../../../config';

export default class DropZoneTile extends Phaser.GameObjects.Zone {
  //owned sprite:
  private bgSprite: Phaser.GameObjects.Sprite;
  //owned object:
  private objectSprite: ArticodingObject;

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
    const icon = (<LevelEditor>(this.scene)).getSelectedIcon();
    if(icon.texture === undefined)
      return;

    if(icon.texture === "background") {
      const scaleFactor = this.width / config.TILE_SIZE;
      const bgObject = this.scene.add.sprite(this.x, this.y, icon.texture, icon.frame);
      bgObject.setScale(scaleFactor);
      this.setBgSprite(bgObject);
    } else {
      this.setObjectSprite(new ArticodingObject(<LevelEditor>(this.scene), this, icon.texture, icon.frame));
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

  addSprite(sprite: ArticodingObject) {
    this.objectSprite = sprite;
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

  setObjectSprite(sprite: ArticodingObject) {
    if (this.objectSprite) {
      // Replace current object sprite
      console.log("Destroyed old sprite");
      this.objectSprite.destroy();
    }

    if (this.bgSprite !== undefined) {
      // Create duplicate sprite only if has background
      this.objectSprite = sprite;
    } else {
      // Destroy sprite
      sprite.destroy();
    }
  }

  setBgSprite(sprite: Phaser.GameObjects.Sprite | undefined) {
    this.bgSprite = sprite;
    if(!this.bgSprite)
      this.objectSprite?.destroy();
  }
}