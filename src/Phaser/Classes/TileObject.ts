import * as Phaser from "phaser";

import ArticodingObject from "./ArticodingObject";

export default class TileObject extends Phaser.GameObjects.Sprite {
  occupied: Boolean = false;
  object: ArticodingObject | undefined;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string | Phaser.Textures.Texture
  ) {
    super(scene, x, y, texture);
    this.scene = scene;

    this.setInteractive();
    this.input!.dropZone = true;
    this.scene.add.existing(this);
  }

  addObject(object: ArticodingObject) {
    if (!this.occupied) {
      object.x = this.x;
      object.y = this.y;
      object.origX = this.x;
      object.origY = this.y;
      this.object = object;
      this.occupied = true;
    }
  }

  deleteObject() {
    if (this.object !== undefined){
      this.object.resetOrDestroy();
      this.occupied = false;
      this.object = undefined;
    }
  }
}
