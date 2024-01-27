import * as Phaser from "phaser";

import LevelEditor from "../LevelEditor";
import DropZoneTile from "./DropZoneTile";

export default class ArticodingObject extends Phaser.GameObjects.Sprite {
  allowDestruction: Boolean = false;
  isOnDropZone: Boolean = false;
  origX: number;
  origY: number;

  constructor(
    scene: LevelEditor,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture,
    frame?: string | number | undefined,
    allowDestruction?: Boolean
  ) {
    super(scene, x, y, texture, frame);
    this.scene = scene;
    this.origX = x;
    this.origY = y;
    this.allowDestruction = allowDestruction;

    this.setScale((<LevelEditor>this.scene).scaleFactor);

    this.setInteractive();
    this.scene.input.setDraggable(this);

    this.on("drag", (pointer, dragX, dragY) => this.onDrag(dragX, dragY));
    this.on("dragstart", (dropZone) => this.onDragStart(dropZone));
    this.on("dragenter", (pointer, dropZone) => this.onDragEnter());
    this.on("dragleave", (pointer, dropZone) => this.onDragLeave());
    this.on("dragend", (pointer) => this.onDragEnd());
    this.on("drop", (pointer, dropZone) => this.onDrop(dropZone));

    this.scene.add.existing(this);
  }

  onDrag(dragX: number, dragY: number) {
    this.x = dragX;
    this.y = dragY;
  }

  onDragStart(dropZone) {
    this.scene.children.bringToTop(this);
    // let tile = this.board.findTile(this);
    // if (tile !== undefined) {
    //   this.isOnDropZone = true;
    // }
  }

  onDragEnter() {
    this.isOnDropZone = true;
  }

  onDragLeave() {
    this.isOnDropZone = false;
  }

  onDragEnd() {
    if (!this.isOnDropZone) {
      if (this.allowDestruction) {
        this.destroy();
      } else {
        this.x = this.origX;
        this.y = this.origY;
      }
    }
  }

  onDrop(dropZone: DropZoneTile) {
    if (this.isOnDropZone) {
      dropZone.setObjectSprite(this);

      this.isOnDropZone = false;
    } else {
      // Should never get here?
      this.x = this.origX;
      this.y = this.origY;
    }
  }

  resetOrDestroy() {
    // Reset/Destroy object
    if (this.allowDestruction) {
      this.destroy();
    } else {
      this.x = this.origX;
      this.y = this.origY;
    }
  }
}
