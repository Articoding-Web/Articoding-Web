import * as Phaser from "phaser";
import LevelPlayer from "./scenes/LevelPlayer";
import LevelEditor from "./scenes/LevelEditor";

function createPhaserConfig(scenes: Phaser.Types.Scenes.SceneType | Phaser.Types.Scenes.SceneType[]): Phaser.Types.Core.GameConfig {
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
    scene: scenes,
  };
  return PhaserConfig;
}

export default class PhaserController {
  game: Phaser.Game;

  constructor() {
    this.game = new Phaser.Game(createPhaserConfig(LevelEditor));
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
    globalThis.phaserDiv.classList.add("col-lg-8");
  }

  startScene(key: string, data?: object) {
    const scene = this.getSceneFromKey(key);
    this.game.destroy(false);
    this.game = new Phaser.Game(createPhaserConfig(scene));
  }

  getSceneFromKey(key: string) : Phaser.Types.Scenes.SceneType {
    switch(key){
      case "LevelEditor":
        return LevelEditor;
      case "LevelPlayer":
        return LevelPlayer;
    }
  }
}
