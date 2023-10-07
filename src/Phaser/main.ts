import * as Phaser from "phaser";

import Menu from "./scenes/Menu";
import Editor from "./scenes/Editor";

const configuration = {
  type: Phaser.AUTO,
  backgroundColor: "#FFFFFF",
  parent: "game",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: window.innerWidth,
    height: window.innerHeight,
  },
  dom: {
    createContainer: true,
  },
  scene: [Menu, Editor],
};

const game = new Phaser.Game(configuration);
