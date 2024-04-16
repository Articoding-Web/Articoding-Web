import * as Phaser from "phaser";
import LevelPlayer from "./LevelPlayer/Phaser/LevelPlayer";
import LevelEditor from "./LevelEditor/LevelEditor";
import Blockly from "blockly";
import blocks from "./LevelPlayer/Blockly/Blocks/blocks";
function createPhaserConfig(): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.CANVAS,
    parent: "phaserDiv",
    canvas: <HTMLCanvasElement>document.getElementById("phaserCanvas"),
    scale: {
      // Fit to window
      mode: Phaser.Scale.ScaleModes.RESIZE,
      // Center vertically and horizontally
      autoCenter: Phaser.Scale.CENTER_BOTH,
      zoom: Phaser.Scale.ZOOM_2X,
    },
    banner: false,
    scene: [(new Phaser.Scene), LevelPlayer, LevelEditor]
  };
}

export default class PhaserController {
  private static game: Phaser.Game;

  static init(key: string, scene: Phaser.Types.Scenes.SceneType, data?: object) {
    if (!PhaserController.game) {
      PhaserController.game = new Phaser.Game(createPhaserConfig());
    }

    PhaserController.game.scene.start(key, data);
  }

  static async destroyGame(): Promise<void> {
    return new Promise<void>((resolve) => {
      if (PhaserController.game) {
        // Listen for the DESTROY event
        PhaserController.game.events.once(Phaser.Core.Events.DESTROY, () => {
          PhaserController.game = undefined;
          resolve();
        });

        // Flags the game instance as needing to be destroyed
        PhaserController.game.destroy(false);
      } else {
        resolve();
      }
    });
  }
  static async defineBlocks() {
    Blockly.defineBlocksWithJsonArray(blocks);
  }
}