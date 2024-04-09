import * as Phaser from "phaser";
import { Player } from "./Player";
import ArticodingSprite from "./ArticodingSprite";
import config from "../../../config";

export default class TrapObject extends ArticodingSprite {
  isOn = false;

  constructor(scene: Phaser.Scene, tileX: number, tileY: number, texture: string | Phaser.Textures.Texture) {
    super(scene, tileX, tileY, texture);
    this.scene = scene;
    this.scene.add.existing(this);

    document.addEventListener("change_status", this.changeStatus);
  }

  private changeStatus = (e) => {
    const data = (<CustomEvent>e).detail;
    const turnOn = (data.status === "ON");

    if (this.isOn && !turnOn) {
      // Turn off
      this.disable();
    } else if (!this.isOn && turnOn) {
      // Turn on
      this.enable();
    }
  }

  collide(player: Player): void {
    if (this.isOn) {
      console.log("trap killing player");
      player.kill();
    }
  }

  private enable() {
    console.log("enabling");
    this.anims.play({ key: "trap", duration: config.MOVEMENT_ANIMDURATION });
    this.isOn = true;
  }

  private disable() {
    console.log("disabling");
    this.isOn = false;
    this.anims.playReverse({ key: "trap", duration: config.MOVEMENT_ANIMDURATION });
  }

  destroy(fromScene?: boolean): void {
    document.removeEventListener("change_status", this.changeStatus);
    super.destroy(fromScene);
  }
}
