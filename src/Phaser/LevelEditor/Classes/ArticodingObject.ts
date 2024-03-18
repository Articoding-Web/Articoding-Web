import * as Phaser from "phaser";
import LevelEditor from "../LevelEditor";
import DropZoneTile from "./DropZoneTile";
import config from "../../../config";

export default class ArticodingObject extends Phaser.GameObjects.Sprite {
  isOnDropZone: Boolean = false;
  dropZoneTile: DropZoneTile;

  constructor(scene: LevelEditor, dropZoneTile: DropZoneTile, texture: string | Phaser.Textures.Texture, frame?: string | number | undefined) {
    super(scene, dropZoneTile.x, dropZoneTile.y, texture, frame);
    this.scene = scene;
    this.dropZoneTile = dropZoneTile;

    const scaleFactor = this.dropZoneTile.width / config.TILE_SIZE;
    this.setScale(scaleFactor);

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
  }

  onDragEnter() {
    this.isOnDropZone = true;
  }

  onDragLeave() {
    this.isOnDropZone = false;
  }

  onDragEnd() {
    if (!this.isOnDropZone) {
      this.destroy();
    }
  }

  onDrop(dropZone: DropZoneTile) {
    if (!this.isOnDropZone) {
      this.dropZoneTile.setObjectSprite(undefined);
      this.destroy();
    } else {
      this.x = this.dropZoneTile.x;
      this.y = this.dropZoneTile.y;
    }
  }
}