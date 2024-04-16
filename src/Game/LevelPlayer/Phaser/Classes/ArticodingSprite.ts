import * as Phaser from "phaser";
import { Player } from "./Player";
import EnemyObject from "./Enemy";

export default abstract class ArticodingSprite extends Phaser.GameObjects.Sprite {

  constructor(scene: Phaser.Scene, protected tileX: number, protected tileY: number, texture: string | Phaser.Textures.Texture) {
    super(scene, tileX, tileY, texture);
    this.scene = scene;
    this.scene.add.existing(this);
  }

  getPosition(): Phaser.Math.Vector2 {
    return new Phaser.Math.Vector2(this.tileX, this.tileY);
  }

  abstract collide(player: Player | EnemyObject): void;
}
