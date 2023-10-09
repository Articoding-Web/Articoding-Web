import * as Phaser from 'phaser';

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

  constructor() {
    super("Editor");
  }

  preload(): void {
    this.load.image("tile", "assets/Tiles/tile.png");
    this.load.image("laser", "assets/sprites/laser.png");
  }

  create(): void {
    this.turret();
    this.rows = INITIAL_TILES;
    this.columns = INITIAL_TILES;

    this.level();

    this.setDragEvents();
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
