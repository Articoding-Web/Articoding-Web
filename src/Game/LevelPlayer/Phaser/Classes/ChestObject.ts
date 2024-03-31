import * as Phaser from "phaser";
import { Player } from "./Player";
import ArticodingSprite from "./ArticodingSprite";

export default class ChestObject extends ArticodingSprite {

  constructor(scene: Phaser.Scene, tileX: number, tileY: number, texture: string | Phaser.Textures.Texture, id: string) {
    super(scene, tileX, tileY, texture, id);
  }
  
  collide(player: Player): void {
    player.collectChest();
  }
}
