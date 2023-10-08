import Phaser from 'phaser';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin';
import blocks from '../Blockly/blocks';

const COLOR_LIGHT = 0x7b5e57;
const COLOR_PRIMARY = 0x4e342e;

const TILE_SIZE = 100;
const INITIAL_TILES = 5;
const MIN_TILES = 2;
const MAX_TILES = 10;

const LASER_START_X = 200;
const LASER_START_Y = 500;

// Dialog x, y coordinates
const DIAG_X = 110;
const DIAG_Y = 100;

export default class Editor extends Phaser.Scene {
  rows: integer;
  columns: integer;
  tiles: Phaser.GameObjects.Sprite[] = [];
  laser: Phaser.GameObjects.Sprite;
  rexUI: RexUIPlugin;

  constructor() {
    super("Editor");
  }

  preload(): void {
    this.plugins.installScenePlugin('rexUI', RexUIPlugin, 'rexUI');
    this.load.image("tile", "assets/Tiles/tile.png");
    this.load.image("laser", "assets/sprites/laser.png");
  }

  create(): void {
    this.turret();
    this.rows = INITIAL_TILES;
    this.columns = INITIAL_TILES;

    this.level();

    this.setDragEvents();

    let dimensions = this.dialog({
      title: "Tablero",
      columns: this.columns,
      rows: this.rows,
    });
  }

  level(): void {
    const SCREEN_WIDTH = this.cameras.main.width;
    const SCREEN_HEIGHT = this.cameras.main.height;
    let x = (SCREEN_WIDTH - this.rows * TILE_SIZE) / 2;
    let y = (SCREEN_HEIGHT - this.columns * TILE_SIZE) / 2;

    let tiles = this.rows * this.columns;

    if (tiles < this.tiles.length) {
      this.laser.setPosition(LASER_START_X, LASER_START_Y);

      while (this.tiles.length > tiles) {
        console.debug("Destroying tiles");
        this.tiles.pop()?.destroy();
      }
    } else if (tiles > this.tiles.length) {
      this.laser.setPosition(LASER_START_X, LASER_START_Y);

      while (this.tiles.length < tiles) {
        console.debug("Creating tiles");
        const tile = this.add.sprite(0, 0, "tile").setInteractive();
        tile.input!.dropZone = true;
        this.tiles.push(tile);
      }
    }

    this.tiles = Phaser.Actions.GridAlign(this.tiles, {
      width: this.rows,
      height: this.columns,
      cellWidth: TILE_SIZE,
      cellHeight: TILE_SIZE,
      x,
      y,
    });
  }

  dialog = function (configuration) {
    let scene = this;
    var horizontal: integer = configuration.columns;
    var vertical: integer = configuration.rows;
    var title: string = configuration.title;

    var background = scene.rexUI.add.roundRectangle(
      0,
      0,
      10,
      10,
      10,
      COLOR_PRIMARY
    );

    var title: string = scene.add.text(0, 0, title);

    var even: string = scene.add.text(35, 65, "Filas", { color: "white" });
    var upright: string = scene.add.text(35, 105, "Columnas", {
      color: "white",
    });

    var width = scene.rexUI.add
      .label({
        orientation: "x",
        background: scene.rexUI.add
          .roundRectangle(0, 0, 10, 10, 10)
          .setStrokeStyle(1, COLOR_LIGHT),
        text: scene.rexUI.add.BBCodeText(0, 0, horizontal, {
          fixedWidth: 50,
          fixedHeight: 20,
          valign: "center",
          halign: "center",
        }),
        space: { top: 5, bottom: 5, left: 5, right: 5 },
      })
      .setInteractive()
      .on("pointerdown", function () {
        var configuration = {
          onTextChanged: function (object, number: integer) {
            horizontal = number;
            object.text = horizontal;
          },
        };
        scene.rexUI.edit(width.getElement("text"), configuration);
      });

    var height = scene.rexUI.add
      .label({
        orientation: "x",
        background: scene.rexUI.add
          .roundRectangle(120, 123, 10, 10, 10)
          .setStrokeStyle(1, COLOR_LIGHT),
        text: scene.rexUI.add.BBCodeText(0, 0, vertical, {
          fixedWidth: 50,
          fixedHeight: 20,
          valign: "center",
          halign: "center",
        }),
        space: { top: 5, bottom: 5, left: 5, right: 5 },
      })
      .setInteractive()
      .on("pointerdown", function () {
        var configuration = {
          onTextChanged: function (object, number: integer) {
            vertical = number;
            object.text = vertical;
          },
        };
        scene.rexUI.edit(height.getElement("text"), configuration);
      });

    var resize = scene.rexUI.add
      .label({
        orientation: "x",
        background: scene.rexUI.add.roundRectangle(0, 0, 10, 10, 10, COLOR_LIGHT),
        text: scene.add.text(0, 0, "Generar"),
        space: { top: 8, bottom: 8, left: 8, right: 8 },
      })
      .setInteractive()
      .on("pointerdown", function () {
        console.log(horizontal);
        console.log(vertical);
        if (horizontal < MIN_TILES || vertical < MIN_TILES) {
          // TODO: Error too small
          console.error("Too small");
          return;
        } else if (horizontal > MAX_TILES || vertical > MAX_TILES) {
          // TODO: Error too big
          console.error("Too big");
          return;
        } else {
          this.scene.rows = vertical;
          this.scene.columns = horizontal;
          this.scene.level();
        }
      });

    var dialog = scene.rexUI.add
      .sizer({
        orientation: "y",
        x: DIAG_X,
        y: DIAG_Y,
      })
      .addBackground(background)
      .add(
        title,
        0,
        "center",
        { top: 10, bottom: 10, left: 10, right: 10 },
        false
      )
      .add(width, 0, "center", { bottom: 10, left: 100, right: 10 }, true)
      .add(height, 0, "center", { bottom: 10, left: 100, right: 10 }, true)
      .add(resize, 0, "center", { bottom: 10, left: 10, right: 10 }, false)
      .layout();
    return dialog;
  };

  setDragEvents(): void {
    this.input.on("dragenter", (pointer, gameObject, dropZone) => {
      dropZone.setTint(0x00ff00);
    });

    this.input.on("dragleave", (pointer, gameObject, dropZone) => {
      dropZone.clearTint();
    });

    this.input.on("drop", (pointer, gameObject, dropZone) => {
      gameObject.x = dropZone.x;
      gameObject.y = dropZone.y;

      dropZone.clearTint();
    });
  }

  turret(): void {
    this.laser = this.add.sprite(LASER_START_X, LASER_START_Y, "laser");
    this.laser.setInteractive();
    const targetWidth = 200;
    const targetHeight = 200;
    const scaleFactor = Math.min(
      targetWidth / this.laser.width,
      targetHeight / this.laser.height
    );
    this.laser.setScale(scaleFactor);

    this.input.setDraggable(this.laser);

    this.input.on(
      "dragstart",
      function (pointer, gameObject) {
        this.children.bringToTop(gameObject);
      },
      this
    );

    this.input.on("drag", (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });
  }
}
