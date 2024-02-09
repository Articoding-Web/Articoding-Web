import * as Phaser from "phaser";
import EditorBoard from "./Classes/EditorBoard";
import config from "../config";
import ArticodingObject from "./Classes/ArticodingObject";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import TabPages from "phaser3-rex-plugins/templates/ui/tabpages/TabPages";
import GridTable from "phaser3-rex-plugins/plugins/gridtable";
import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import Label from "phaser3-rex-plugins/templates/ui/label/Label";

// TODO: eliminar magic numbers
const NUM_ROWS = 5;
const NUM_COLS = 5;
const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;
const SELECTOR_WIDTH = 500;
const SELECTOR_HEIGHT = 800;

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
    this.load.setBaseURL(themePath);
    this.load.multiatlas("player", "player.json");
    this.load.image("chest", "chest.png");
    this.load.multiatlas("trap", "trap.json");
    this.load.image("wall", "wall.png");
    this.load.multiatlas("background", "background.json")

    //por alguna razon sin eso no funciona, a pesar de que YA ESTA
    this.load.scenePlugin("rexuiplugin", RexUIPlugin, undefined, "rexUI");

    // TODO: load level or default assets
  }

  create(): void {
    this.board = new EditorBoard(this, NUM_ROWS, NUM_COLS);

    // let menuItems = this.CreateMenu(this, []);
    // this.addSpritesToMenu(menuItems);

    this.createTabMenu();

    // let sizer = this.rexUI.add
    //   .overlapSizer({
    //     anchor: {
    //       left: "left",
    //       top: "top",
    //       width: "100%",
    //       height: "100%",
    //     }
    //   })
    //   .add(menu, { align: "left-center", expand: false, minWidth: 300, minHeight: 500 })
    //   .add(menuBG, { align: "left-center", expand: false, minWidth: 300, minHeight: 500 })
    //   .layout();

    // TESTING
    // const chest = new ArticodingObject(this,100,100,this.board.getScaleFactor(),"chest",0,false);
  }

  createTabMenu() {
    let tabPages = this.rexUI.add.tabPages({
      x: SELECTOR_WIDTH / 2, y: SELECTOR_HEIGHT / 2,
      width: SELECTOR_WIDTH, height: SELECTOR_HEIGHT,
      background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_DARK),
      expand: {
        tabs: false
      },
      tabs: {
        space: { item: 2 }
      },
      pages: {
        fadeIn: 300
      },
      align: {
        tabs: 'left'
      },

      space: { right: 5, bottom: 5, item: 10 }
    })
      .on('tab.focus', function (tab, key) {
        tab.getElement('background').setStrokeStyle(2, COLOR_LIGHT);
      })
      .on('tab.blur', function (tab, key) {
        tab.getElement('background').setStrokeStyle();
      })

    tabPages
      .addPage({
        key: 'Background',
        tab: this.CreateTabLabel(this, 'Background'),
        page: this.getGrid()
      })
      .addPage({
        key: 'Items',
        tab: this.CreateTabLabel(this, 'Items'),
        page: this.getGrid()
      })
      .layout()
      .swapFirstPage();

    // Remove page testing
    // tabPages.removePage('page2', true).layout();
  }

  getGrid() {
    const scene = this;
    var scrollMode = 0; // 0:vertical, 1:horizontal
    var gridTable = this.rexUI.add.gridTable({
      x: 400,
      y: 300,
      width: (scrollMode === 0) ? 300 : 420,
      height: (scrollMode === 0) ? 420 : 300,

      scrollMode: <GridTable.ScrollModeType>scrollMode,

      background: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_PRIMARY),

      table: {
        cellWidth: (scrollMode === 0) ? undefined : 60,
        cellHeight: (scrollMode === 0) ? 60 : undefined,
        columns: 2,
        mask: {
          padding: 2,
        },

        reuseCellContainer: true,
      },

      slider: {
        track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
        thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT),
      },

      mouseWheelScroller: {
        focus: false,
        speed: 0.1
      },

      space: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,

        table: 10,
        header: 10,
        footer: 10,
      },

      createCellContainerCallback: function (cell, cellContainer) {
        var width = cell.width,
            height = cell.height,
            item = cell.item,
            index = cell.index;
        if (cellContainer === null) {
            cellContainer = scene.rexUI.add.label({
                width: width,
                height: height,

                orientation: <Sizer.OrientationTypes>scrollMode,
                background: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 0).setStrokeStyle(2, COLOR_DARK),
                icon: scene.rexUI.add.roundRectangle(0, 0, 20, 20, 10, 0x0),
                text: scene.add.text(0, 0, 'fuck'),

                space: {
                    icon: 10,
                    left: (scrollMode === 0) ? 15 : 0,
                    top: (scrollMode === 0) ? 0 : 15,
                }
            });
            console.log(cell.index + ': create new cell-container');
        } else {
            console.log(cell.index + ': reuse cell-container');
        }

        // Set properties from item value
        (<Label>cellContainer).setMinSize(width, height); // Size might changed in this demo
        return cellContainer;
    },
      items: this.CreateItems(100)
    }).layout()
    //.drawBounds(this.add.graphics(), 0xff0000);

    return gridTable;
  }

  CreateItems(count) {
    var data = [];
    for (var i = 0; i < count; i++) {
      data.push({
        id: i,
        color: "0xffffff"
      });
    }
    return data;
  }

  CreatePage(itemTypes: String) {
    const gridTable = this.rexUI.add.gridTable({
      x: 0,
      y: 0,
      width: SELECTOR_WIDTH,
      height: SELECTOR_WIDTH,

      scrollMode: 'vertical',

      background: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_PRIMARY),

      table: {
        cellWidth: config.TILE_SIZE,
        cellHeight: config.TILE_SIZE,
        columns: 2,

        mask: {
          padding: 2,
        },

        reuseCellContainer: true,
      },

      slider: {
        track: this.rexUI.add.roundRectangle(0, 0, 20, 10, 10, COLOR_DARK),
        thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 13, COLOR_LIGHT),
      },

      mouseWheelScroller: {
        focus: false,
        speed: 0.1
      },

      space: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,

        table: 10,
      },

      createCellContainerCallback: function (cell, cellContainer) {
        let width = cell.width,
          height = cell.height;
        if (cellContainer === null) {
          cellContainer = this.rexUI.add.label({
            width: width,
            height: height,

            orientation: 0,
            background: this.rexUI.add.roundRectangle(0, 0, 20, 20, 0).setStrokeStyle(2, COLOR_DARK),
            icon: this.rexUI.add.roundRectangle(0, 0, 20, 20, 10, 0x0),
            text: this.add.text(0, 0, ''),

            space: {
              icon: 10,
              left: 15,
              top: 0,
            }
          });
          console.log(cell.index + ': create new cell-container');
        } else {
          console.log(cell.index + ': reuse cell-container');
        }

        return cellContainer;
      },
      items: this.CreateItems(itemTypes)
    }).layout();

    return gridTable;
  }

  CreateTabLabel(scene, text) {
    return scene.rexUI.add.label({
      width: 40, height: 40,

      background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_PRIMARY),
      text: scene.add.text(0, 0, text, { fontSize: 24 }),

      space: { left: 10, right: 10, top: 10, bottom: 10 }
    })
  }

  // addBackgroundToMenu(container: Phaser.GameObjects.Container) {
  //   const frameNames = this.textures.get("background").getFrameNames();

  //   for (let x = 0; x < frameNames.length; x++) {
  //     let sprite = this.add.sprite(0, x * config.TILE_SIZE, "background", frameNames[x]);
  //     sprite.scale = this.board.getScaleFactor();
  //     container.add(sprite);
  //   }
  // }

  // addSpritesToMenu(menu: RexUIPlugin.Menu) {
  //   let spriteNames = config.SPRITE_NAMES;

  //   for (let i = 0; i < spriteNames.length; i++) {
  //     if (spriteNames[i] !== "background") {
  //       let sprite = this.add.sprite(0, 0, spriteNames[i]);
  //       sprite.scale = this.board.getScaleFactor();
  //       menu.add(sprite);
  //     }
  //   }
  // }

  // resizeMenu(menu: RexUIPlugin.Menu) {
  //   let children = menu.getAllChildren();
  //   //function fired on scale factor change, remove children and add them again, with a different scale factor
  //   for (let i in children) {
  //     menu.remove(children[i]);
  //   }
  //   // now add them with current scale factor:
  //   this.addSpritesToMenu(menu);
  // }

  // CreateMenu(): RexUIPlugin.Menu {
  //   let menu = this.rexUI.add.menu({
  //     orientation: "y",
  //     popup: false,
  //     items: [],
  //     background: this.add.rectangle(),
  //     // easeIn: 500,
  //     easeIn: {
  //       duration: 500,
  //       orientation: "y",
  //     },

  //     // easeOut: 100,
  //     easeOut: {
  //       duration: 100,
  //       orientation: "y",
  //     },

  //     // expandEvent: 'button.over',

  //     // space: { item: 10 }
  //   });

  //   // menu
  //   //   .on("button.over", function (button) {
  //   //     button.getElement("background").setStrokeStyle(1, 0xffffff);
  //   //   })
  //   //   .on("button.out", function (button) {
  //   //     button.getElement("background").setStrokeStyle();
  //   //   })
  //   //   .on("button.click", function (button) {
  //   //     onClick(button);
  //   //   })
  //   //   .on("popup.complete", function (subMenu) {
  //   //     console.log("popup.complete");
  //   //   })
  //   //   .on("scaledown.complete", function () {
  //   //     console.log("scaledown.complete");
  //   //   });

  //   return menu;
  // }
  // 
  // createButton(icon: string): RexUIPlugin.Label {
  //   console.log(icon);
  //   let iconStyle = {};
  //   switch (icon) {
  //     case "player": {
  //       iconStyle = {
  //         key: icon,
  //         frame: "0",
  //       };
  //       break;
  //     }
  //     case "trap":
  //       iconStyle = {
  //         key: icon,
  //         frame: "3"
  //       };
  //       break;
  //     default: {

  //       iconStyle = {
  //         key: icon,
  //       };
  //       break;
  //     }
  //   }

  //   let buttonLabel = this.rexUI.add.label({
  //     width: 32,
  //     height: 32,
  //     background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 2, 0x7b5e57),
  //     icon: this.rexUI.add.statesImage(iconStyle),
  //     space: {
  //       left: 5,
  //       right: 5,
  //       top: 5,
  //       bottom: 5,
  //     },
  //   });

  //   // Make the button draggable
  //   this.rexUI.add.drag(buttonLabel);

  //   return buttonLabel;
  // }
}