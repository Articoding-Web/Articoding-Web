import * as Phaser from 'phaser';
import Menu from "./scenes/Menu";
import Editor from "./scenes/Editor";

const PhaserConfig : Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: "#FFFFFF",
  parent: "phaserDiv",
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  dom: {
    createContainer: true,
  },
  scene: [Menu, Editor]
};

export default PhaserConfig;