import * as Phaser from 'phaser';
import Menu from "./scenes/Menu";
import Editor from "./scenes/Editor";

const PhaserConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  parent: 'phaserDiv',
  canvas: <HTMLCanvasElement>document.getElementById('phaserCanvas'),
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Menu, Editor]
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
    window.dispatchEvent(new Event('resize'));
  }

  reduceSize() {
    globalThis.phaserDiv.classList.remove("w-100");
    globalThis.phaserDiv.classList.remove("mx-auto");
    globalThis.phaserDiv.classList.add("col-lg-7");
    window.dispatchEvent(new Event('resize'));
  }

  startScene(key: string | Phaser.Scene) {
    // Stop all active scenes
    this.game.scene.getScenes(true).forEach(
      scene => this.game.scene.stop(scene)
    );
    this.game.scene.start(key);
  }
}