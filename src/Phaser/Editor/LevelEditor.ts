import * as Phaser from "phaser";
import EditorBoard from "./Classes/EditorBoard";
import config from "../config";
import ArticodingObject from "./Classes/ArticodingObject";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
// TODO: eliminar magic numbers
const NUM_ROWS = 5;
const NUM_COLS = 5;

export default class LevelEditor extends Phaser.Scene {
  rexUI: RexUIPlugin;
  board: EditorBoard;
  // selector: spriteSelector
  // leveldata

  constructor() {
    super("LevelEditor");
  }

  init(): void {
    // TODO: get leveldata  (if passing from player to editor)
  }

  preload(): void {
    const themePath = `assets/sprites/default`;
   this.load.image("chest", `${themePath}/chest.png`);
    this.load.multiatlas("player", `${themePath}/player.json`, themePath);
   this.load.multiatlas("trap", `${themePath}/trap.json`, themePath);
    this.load.image("wall", `${themePath}/wall.png`);
    //por alguna razon sin eso no funciona, a pesar de que YA ESTA
    this.load.scenePlugin({
      key: "rexuiplugin",
      url: "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
      sceneKey: "rexUI",
    });

    // TODO: load level or default assets
  }

  create(): void {
    //  let items: RexUIPlugin.Label[] = [];
    let menu = this.CreateMenu(this, []);
      // .add(this.createButton("chest"))
      // .add(this.createButton("player"))
      // .add(this.createButton("trap"))
      // .add(this.createButton("wall"));

    this.addSpritesToMenu(menu);
      
    let sizer = this.rexUI.add
      .overlapSizer({
        anchor: {
          left: "left",
          top: "top",
          width: "100%",
          height: "100%",
        }
      })
      .add(menu, { align: "left-center", expand: false, minWidth: 300, minHeight: 500})
      .layout();

    this.board = new EditorBoard(this, NUM_ROWS, NUM_COLS);

    // TESTING
    // const chest = new ArticodingObject(this,100,100,this.board.getScaleFactor(),"chest",0,false);
    }
    
    addSpritesToMenu(menu) {
      // objects
      menu.add(this.add.sprite(0,0, "chest"))
      .add(this.add.sprite(0, 0, "player"))
      .add(this.add.sprite(0, 0, "trap", "3.png"))
      .add(this.add.sprite(0, 0, "wall"));

      // background

    }

  CreateMenu(
    scene: Phaser.Scene,
    items: RexUIPlugin.Label[]
  ): RexUIPlugin.Menu {
    let menu = this.rexUI.add.menu({
      orientation: "y",
      popup: false,
      items: items,
      background: this.add.rectangle(),
      // easeIn: 500,
      easeIn: {
        duration: 500,
        orientation: "y",
      },

      // easeOut: 100,
      easeOut: {
        duration: 100,
        orientation: "y",
      },

      // expandEvent: 'button.over',

      // space: { item: 10 }
    });

    // menu
    //   .on("button.over", function (button) {
    //     button.getElement("background").setStrokeStyle(1, 0xffffff);
    //   })
    //   .on("button.out", function (button) {
    //     button.getElement("background").setStrokeStyle();
    //   })
    //   .on("button.click", function (button) {
    //     onClick(button);
    //   })
    //   .on("popup.complete", function (subMenu) {
    //     console.log("popup.complete");
    //   })
    //   .on("scaledown.complete", function () {
    //     console.log("scaledown.complete");
    //   });

    return menu;
  }

  createButton(icon: string): RexUIPlugin.Label {
    console.log(icon);
    let iconStyle = {};
    switch (icon) {
      case "player": {
        iconStyle = {
          key: icon,
          frame: "0",
        };
        break;
      }
      case "trap":
        iconStyle = {
          key: icon,
          frame: "3"
        };
        break;
      default:{

        iconStyle = {
          key: icon,
        };
        break;
      }
    }

    let buttonLabel = this.rexUI.add.label({
      width: 32,
      height: 32,
      background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 2, 0x7b5e57),
      icon: this.rexUI.add.statesImage(iconStyle),
      space: {
        left: 5,
        right: 5,
        top: 5,
        bottom: 5,
      },
    });

    // Make the button draggable
    this.rexUI.add.drag(buttonLabel);

    return buttonLabel;
  }
}
