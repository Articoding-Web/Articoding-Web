import * as Phaser from "phaser";
import EditorBoard from "./Classes/EditorBoard";
import config from "../config";
import ArticodingObject from "./Classes/ArticodingObject";
import RexUIPlugin from "phaser3-rex-plugins/templates/ui/ui-plugin.js";
import TabPages from "phaser3-rex-plugins/templates/ui/tabpages/TabPages";
import GridTable from "phaser3-rex-plugins/plugins/gridtable";
import Sizer from "phaser3-rex-plugins/templates/ui/sizer/Sizer";
import Label from "phaser3-rex-plugins/templates/ui/label/Label";
import RoundRectangle from "phaser3-rex-plugins/plugins/roundrectangle";

// TODO: eliminar magic numbers
const NUM_ROWS = 5;
const NUM_COLS = 5;
const COLOR_PRIMARY = 0xb0e0e6;
const COLOR_LIGHT = 0x3d85c6;
const COLOR_DARK = 0x003366;
const SELECTOR_WIDTH = 500;
const SELECTOR_HEIGHT = 800;

export default class LevelEditor extends Phaser.Scene {
  rexUI: RexUIPlugin;
  board: EditorBoard;
  // selector: spriteSelector
  // leveldata
  draggableSprites: Phaser.GameObjects.Sprite[];
  constructor() {
    super("LevelEditor");
    this.draggableSprites = [];
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
    this.load.multiatlas("background", "background.json");

    //por alguna razon sin eso no funciona, a pesar de que YA ESTA
    this.load.scenePlugin("rexuiplugin", RexUIPlugin, undefined, "rexUI");

    // TODO: load level or default assets
  }

  create(): void {
    this.board = new EditorBoard(this, NUM_ROWS, NUM_COLS);

    // let menuItems = this.CreateMenu(this, []);
    // this.addSpritesToMenu(menuItems);

    this.createTabMenu();
    //Once created, we prepare the sprites, to make them draggable into the board's drop zones:
    this.prepareSprites();
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

  prepareSprites() {
    for (let i = 0; i < this.draggableSprites.length; i++) {
      const sprite = this.draggableSprites[i];
      this.input.setDraggable(sprite);
      this.input.on("dragstart", this.onDragStart, this);
      this.input.on("drag", this.onDrag, this);
      this.input.on("dragend", this.onDragEnd, this);
    }
  }

  onDragStart(pointer, gameObject) {
    console.log("drag start");
    gameObject.setData("isDragging", true);
  }

  onDrag(pointer, gameObject, dragX, dragY) {
    console.log("dragging");
    if (gameObject.getData("isDragging")) {
      // Move the sprite with the pointer
      gameObject.x = dragX;
      gameObject.y = dragY;
    }
  }

  onDragEnd(pointer, gameObject) {
    if (gameObject.getData("isDragging")) {
      // Check if the sprite is dropped onto a dropzone
      const dropzone = this.board.getDropZoneAt(pointer.x, pointer.y);
      if (dropzone) {
        // Add the sprite to the dropzone
        dropzone.addSprite(gameObject);
      }
      // Reset the sprite's position
      gameObject.x = gameObject.input.dragStartX;
      gameObject.y = gameObject.input.dragStartY;
      // Reset the dragging flag
      gameObject.setData("isDragging", false);
    }
  }

  createTabMenu() {
    let tabPages = this.rexUI.add
      .tabPages({
        x: SELECTOR_WIDTH / 2,
        y: SELECTOR_HEIGHT / 2,
        width: SELECTOR_WIDTH,
        height: SELECTOR_HEIGHT,
        background: this.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_DARK),
        expand: {
          tabs: false,
        },
        tabs: {
          space: { item: 2 },
        },
        pages: {
          fadeIn: 300,
        },
        align: {
          tabs: "left",
        },

        space: { right: 5, bottom: 5, item: 10 },
      })
      .on("tab.focus", function (tab, key) {
        tab.getElement("background").setStrokeStyle(2, COLOR_LIGHT);
      })
      .on("tab.blur", function (tab, key) {
        tab.getElement("background").setStrokeStyle();
      });

    tabPages
      .addPage({
        key: "Background",
        tab: this.createTabLabel(this, "Background"),
        page: this.createGridPage(true),
      })
      .addPage({
        key: "Items",
        tab: this.createTabLabel(this, "Items"),
        page: this.createGridPage(false),
      })
      .layout()
      .swapFirstPage();

    // Remove page testing
    // tabPages.removePage('page2', true).layout();
  }
  createTabLabel(scene, text) {
    return scene.rexUI.add.label({
      width: 40,
      height: 40,

      background: scene.rexUI.add.roundRectangle(0, 0, 0, 0, 0, COLOR_PRIMARY),
      text: scene.add.text(0, 0, text, { fontSize: 24 }),

      space: { left: 10, right: 10, top: 10, bottom: 10 },
    });
  }

  createGridPage(isBackgroundGrid: boolean) {
    const scene = this;
    const scrollMode = 0; // 0:vertical, 1:horizontal
    let gridTable = this.rexUI.add
      .gridTable({
        x: 400,
        y: 300,
        width: scrollMode === 0 ? 300 : 420,
        height: scrollMode === 0 ? 420 : 300,

        scrollMode: <GridTable.ScrollModeType>scrollMode,

        background: this.rexUI.add.roundRectangle(
          0,
          0,
          20,
          10,
          10,
          COLOR_PRIMARY
        ),

        table: {
          cellWidth: scrollMode === 0 ? undefined : 60,
          cellHeight: scrollMode === 0 ? 60 : undefined,
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
          speed: 0.1,
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
          let width = cell.width,
            height = cell.height,
            item = cell.item;
          if (cellContainer === null) {
            cellContainer = scene.rexUI.add.label({
              width: width,
              height: height,

              orientation: <Sizer.OrientationTypes>scrollMode,
              background: scene.rexUI.add
                .roundRectangle(0, 0, 20, 20, 0)
                .setStrokeStyle(2, COLOR_DARK),
              icon: <Phaser.GameObjects.Sprite>item,

              space: {
                left: 30,
                top: scrollMode === 0 ? 0 : 15,
              },
            });
          }

          // Set properties from item value
          (<Label>cellContainer).setMinSize(width, height); // Size might changed in this demo
          (<RoundRectangle>(<Label>cellContainer).getElement("background"))
            .setStrokeStyle(2, COLOR_DARK)
            .setDepth(0);
          return cellContainer;
        },
        items: isBackgroundGrid
          ? this.createBackgroundItems()
          : this.createObjectItems(),
      })
      .layout();

    return gridTable;
  }

  createBackgroundItems() {
    let items = [];

    const frameNames = this.textures.get("background").getFrameNames();

    for (let x = 0; x < frameNames.length; x++) {
      let sprite = this.add.sprite(
        0,
        x * config.TILE_SIZE,
        "background",
        frameNames[x]
      );
      sprite.scale = this.board.getScaleFactor() / 2;
      items.push(sprite);
      this.draggableSprites.push(sprite);
    }

    return items;
  }

  createObjectItems() {
    let items = [];

    let spriteNames = config.SPRITE_NAMES;
    for (let i = 0; i < spriteNames.length; i++) {
      if (spriteNames[i] !== "background") {
        let sprite = this.add.sprite(0, 0, spriteNames[i]);
        sprite.scale = this.board.getScaleFactor() / 2;
        items.push(sprite);
        this.draggableSprites.push(sprite);
      }
    }

    return items;
  }
}
