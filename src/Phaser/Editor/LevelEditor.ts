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
    this.load.image("player", `${themePath}/player.png`);
    this.load.image("trap", `${themePath}/trap.png`);
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
    let items: RexUIPlugin.Label[] = [];
    items.push(this.createButton("chest"));
    items.push(this.createButton("player"));
    items.push(this.createButton("trap"));
    items.push(this.createButton("wall"));
    let menu = this.CreateMenu(this, items);
    let sizer = this.rexUI.add.overlapSizer({
      anchor: {
        left: 'left',
        top: 'top',
        width: '100%',
        height: '100%'
      }
    })
    .add(menu, { align: 'left-center', expand: false })
      .layout();

    this.board = new EditorBoard(this, NUM_ROWS, NUM_COLS);


    // TESTING
    // const chest = new ArticodingObject(this,100,100,this.board.getScaleFactor(),"chest",0,false);
  }
/*
 createButtonCallback: function (item, i, items) {
        return this.rexUI.add.label({
          background: this.rexUI.add.roundRectangle(0, 0, 2, 2, 0),
          text: scene.add.text(0, 0, item.name, {
            fontSize: "20px",
          }),
          icon: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, 0x260e04),
          space: {
            left: 10,
            right: 10,
            top: 10,
            bottom: 10,
            icon: 10,
          },
        });
      },
*/

  CreateMenu(scene : Phaser.Scene, items : RexUIPlugin.Label[]): RexUIPlugin.Menu {

    let menu = this.rexUI.add.menu({
      orientation: 'y',
      popup: false,
      items: items,
      // easeIn: 500,
      easeIn: {
        duration: 500,
        orientation: 'y',
      },

      // easeOut: 100,
      easeOut: {
        duration: 100,
        orientation: 'y',
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
    const iconStyle = {
      key: icon,
    };
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
    return buttonLabel;
  }
}
