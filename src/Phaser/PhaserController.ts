import * as Phaser from "phaser";

const PhaserConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.CANVAS,
  parent: "phaserDiv",
  physics: {
    default: 'arcade',
  },
  canvas: <HTMLCanvasElement>document.getElementById("phaserCanvas"),
  scale: {
    // Fit to window
    mode: Phaser.Scale.ScaleModes.RESIZE,
    // Center vertically and horizontally
    autoCenter: Phaser.Scale.CENTER_BOTH,
    zoom: Phaser.Scale.ZOOM_2X,
  },
};

export default class PhaserController {
  game: Phaser.Game;

  constructor(key: string, scene: Phaser.Types.Scenes.SceneType, data?: object) {
    this.game = new Phaser.Game(PhaserConfig);
    this.game.scene.add(key , scene, true, data);
  }

  destroy(){
    this.game.destroy(false, false);
  }
}
