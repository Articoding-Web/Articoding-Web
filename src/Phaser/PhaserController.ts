import * as Phaser from "phaser";
import LevelPlayer from "./scenes/LevelPlayer";
import LevelEditor from "./scenes/LevelEditor";

const PhaserConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  parent: "phaserDiv",
  canvas: <HTMLCanvasElement>document.getElementById("phaserCanvas"),
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [LevelPlayer, LevelEditor],
};

export default class PhaserController {
  game: Phaser.Game;

  constructor() {
    this.game = new Phaser.Game(PhaserConfig);
    const gameInstance = this.game;
  }

  increaseSize() {
    globalThis.phaserDiv.classList.add("w-100");
    globalThis.phaserDiv.classList.add("mx-auto");
    globalThis.phaserDiv.classList.remove("col-lg-8");
  }

  reduceSize() {
    globalThis.phaserDiv.classList.remove("w-100");
    globalThis.phaserDiv.classList.remove("mx-auto");
    globalThis.phaserDiv.classList.add("col-lg-8");
  }

  startScene(key: string | Phaser.Scene, data?: object) {
    // Stop all active scenes
    this.game.scene
      .getScenes(true)
      .forEach((scene) => this.game.scene.stop(scene));
    this.game.scene.start(key, data);
  }
}
