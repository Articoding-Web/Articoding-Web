import * as Phaser from "phaser";

export default class Menu extends Phaser.Scene {
  constructor() {
    super("Menu");
  }

  preload() {
    this.load.image("logo", "assets/sprites/logo.png");
  }

  create() {
    const logo = this.add.image(
      this.cameras.main.centerX,
      this.cameras.main.centerY,
      "logo"
    );
    this.tweens.add({
      targets: logo,
      y: 250,
      duration: 1000,
      ease: "Sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    this.input.once(
      "pointerdown",
      function (event) {
        this.scene.start("Editor", {
          width: this.cameras.main.width,
          height: this.cameras.main.height,
        });
      },
      this
    );
  }
}
