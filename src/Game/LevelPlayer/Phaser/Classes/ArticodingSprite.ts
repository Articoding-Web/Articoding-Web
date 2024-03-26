import * as Phaser from "phaser";
import { Player } from "./Player";

export default abstract class ArticodingSprite extends Phaser.GameObjects.Sprite {

  constructor(
    scene: Phaser.Scene,
    private tileX: number,
    private tileY: number,
    texture: string | Phaser.Textures.Texture
  ) {
    super(scene, tileX, tileY, texture);
    this.scene = scene;
    this.scene.add.existing(this);
  }

  getPosition() : Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(this.tileX, this.tileY);
  }
  
  abstract collide(player: Player): void;
}
