import Phaser from 'phaser';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin';

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
  plugins: {
    scene: [{
      key: 'rexUI',
      plugin: RexUIPlugin,
      mapping: 'rexUI'
    },
    ]
  }
};

const game = new Phaser.Game(configuration);
