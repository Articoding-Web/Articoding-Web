import * as Phaser from 'phaser';
import { LevelData } from '../LevelData';

const TILE_SIZE = 100;
const MIN_NUM_TILES = 2;
const MAX_NUM_TILES = 15;
const INITIAL_TILES = 5;

const LASER_START_X = 200;
const LASER_START_Y = 500;

export default class Editor extends Phaser.Scene {
  resizeDialog = <HTMLDivElement>document.getElementById("gridResizeDialog");
  numRowsInput = <HTMLInputElement>document.getElementById("numRowsInput");
  numColsInput = <HTMLInputElement>document.getElementById("numColsInput");
  rows: integer;
  columns: integer;
  tiles: Phaser.GameObjects.Sprite[] = [];
  laser: Phaser.GameObjects.Sprite;
  level: LevelData;

  constructor() {
    super("Editor");
  }

  init(level? : LevelData): void {
    if(typeof level !== 'object'){
      this.level = level;
    }
  }

  preload(): void {
    this.resizeDialog.classList.remove("d-none");
    this.rows = this.level? this.level.rows : INITIAL_TILES;
    this.columns = this.level? this.level.columns : INITIAL_TILES;
    this.setMinMaxNumTiles();
    this.tiles = [];

    this.load.image("tile", "assets/Tiles/tile.png");
    this.load.image("laser", "assets/sprites/laser.png");
  }

  create(): void {
    this.turret();
    this.createLevel();
    this.setDragEvents();

    document.getElementById("changeGridSize").addEventListener("click", ev => {
      if(+this.numRowsInput.value < MIN_NUM_TILES || +this.numRowsInput.value > MAX_NUM_TILES){
        console.error("Invalid grid HEIGHT");
      }
      else if(+this.numColsInput.value < MIN_NUM_TILES && +this.numColsInput.value > MAX_NUM_TILES){
        console.error("Invalid grid WIDTH");
      } else {
        this.rows = +this.numRowsInput.value;
        this.columns = +this.numColsInput.value;
        this.createLevel();
      }
    })

    this.events.on('shutdown', e => {
      this.resizeDialog.classList.add("d-none");
    })
  }

  setMinMaxNumTiles() {
    this.numColsInput.setAttribute("min", MIN_NUM_TILES.toString());
    this.numColsInput.setAttribute("max", MAX_NUM_TILES.toString());
    this.numColsInput.value = this.columns.toString();
    this.numRowsInput.setAttribute("min", MIN_NUM_TILES.toString());
    this.numRowsInput.setAttribute("max", MAX_NUM_TILES.toString());
    this.numRowsInput.value = this.rows.toString();
  }

  createLevel(): void {
    const SCREEN_WIDTH = this.cameras.main.width;
    const SCREEN_HEIGHT = this.cameras.main.height;
    let x = (SCREEN_WIDTH - this.rows * TILE_SIZE) / 2;
    let y = (SCREEN_HEIGHT - this.columns * TILE_SIZE) / 2;

    let numTiles = this.rows * this.columns;

    if (numTiles < this.tiles.length) {
      this.laser.setPosition(LASER_START_X, LASER_START_Y);

      while (this.tiles.length > numTiles) {
        this.tiles.pop()?.destroy();
      }
    } else if (numTiles > this.tiles.length) {
      this.laser.setPosition(LASER_START_X, LASER_START_Y);

      while (this.tiles.length < numTiles) {
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
