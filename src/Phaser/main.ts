import * as Phaser from 'phaser';
import Menu from "./scenes/Menu";
import Editor from "./scenes/Editor";

const configuration = {
  type: Phaser.AUTO,
  backgroundColor: "#FFFFFF",
  parent: "game",
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  dom: {
    createContainer: true,
  },
  scene: [Menu, Editor]
};

globalThis.game = new Phaser.Game(configuration);