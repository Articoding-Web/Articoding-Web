import * as Phaser from "phaser";

import ArticodingObject from "./ArticodingObject";

export default class TileObject extends Phaser.GameObjects.Sprite {
  object: ArticodingObject | undefined = undefined;

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
    if (!this.isOccupied()) {
      object.x = this.x;
      object.y = this.y;
      object.origX = this.x;
      object.origY = this.y;
      this.object = object;
    }
  }

  isOccupied(){
    return this.object !== undefined;
  }

  deleteObject() {
    if (this.object !== undefined){
      this.object.resetOrDestroy();
      this.object = undefined;
    }
  }
}
