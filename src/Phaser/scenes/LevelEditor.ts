import * as Phaser from "phaser";
import { LevelData } from "../Classes/LevelData";
import ArticodingObject from "../Classes/ArticodingObject";

const TILE_SIZE = 100;
const MIN_NUM_TILES = 2;
const MAX_NUM_TILES = 10;
const INITIAL_TILES = 5;

export default class LevelEditor extends Phaser.Scene {
  resizeDialog = <HTMLDivElement>document.getElementById("gridResizeDialog");
  numRowsInput = <HTMLInputElement>document.getElementById("numRowsInput");
  numColsInput = <HTMLInputElement>document.getElementById("numColsInput");
  rows: integer;
  columns: integer;
  tiles: Phaser.GameObjects.Sprite[] = [];
  laser: Phaser.GameObjects.Sprite;
  chest: Phaser.GameObjects.Sprite;
  level: LevelData;

  objectX: integer;
  objectY: integer;

  constructor() {
    super("LevelEditor");
  }

  init(level?: LevelData): void {
    if (typeof level !== "object") {
      this.level = level;
    }
  }

  preload(): void {
    this.resizeDialog.classList.remove("d-none");
    this.rows = this.level ? this.level.rows : INITIAL_TILES;
    this.columns = this.level ? this.level.columns : INITIAL_TILES;
    this.setMinMaxNumTiles();
    this.tiles = [];
    this.objectX = this.cameras.main.width / 10;
    this.objectY = this.cameras.main.height / 3;

    // Load froggy
    this.load.multiatlas(
      "FrogSpriteSheet",
      "assets/sprites/FrogSpriteSheet.json",
      "assets/sprites/"
    );
    // Load chest
    this.load.multiatlas(
      "BigTreasureChest",
      "assets/sprites/BigTreasureChest.json",
      "assets/sprites/"
    );

    this.load.image("tile", "assets/tiles/tile.png");
  }

  create(): void {
    this.laser = new ArticodingObject(
      this,
      this.objectX,
      this.objectY,
      "FrogSpriteSheet",
      "down/SpriteSheet-02.png"
    );
    this.chest = new ArticodingObject(
      this,
      this.objectX,
      this.objectY + 100,
      "BigTreasureChest",
      "BigTreasureChest-0.png",
      true
    );

    this.createLevel();
    this.zoom();

    document
      .getElementById("changeGridSize")
      .addEventListener("click", (event) => {
        if (
          +this.numRowsInput.value < MIN_NUM_TILES ||
          +this.numRowsInput.value > MAX_NUM_TILES
        ) {
          console.error("Invalid grid HEIGHT");
        } else if (
          +this.numColsInput.value < MIN_NUM_TILES &&
          +this.numColsInput.value > MAX_NUM_TILES
        ) {
          console.error("Invalid grid WIDTH");
        } else {
          let width = this.rows - +this.numRowsInput.value;
          let height = this.columns - +this.numColsInput.value;
          this.rows = +this.numRowsInput.value;
          this.columns = +this.numColsInput.value;
          if (width < 0) {
            this.cameras.main.zoom -= +this.numRowsInput.value * 0.025;
            this.objectX -= +this.numRowsInput.value * 25;
            this.laser.destroy();
            this.laser = new ArticodingObject(
              this,
              this.objectX,
              this.objectY,
              "FrogSpriteSheet",
              "down/SpriteSheet-02.png"
            );
            this.chest.destroy();
            this.chest = new ArticodingObject(
              this,
              this.objectX,
              this.objectY + 100,
              "BigTreasureChest",
              "BigTreasureChest-0.png",
              true
            );
          }
          if (width > 0) {
            this.cameras.main.zoom += +this.numRowsInput.value * 0.025;
            this.objectX += +this.numRowsInput.value * 25;
            this.laser.destroy();
            this.laser = new ArticodingObject(
              this,
              this.objectX,
              this.objectY,
              "FrogSpriteSheet",
              "down/SpriteSheet-02.png"
            );
            this.chest.destroy();
            this.chest = new ArticodingObject(
              this,
              this.objectX,
              this.objectY + 100,
              "BigTreasureChest",
              "BigTreasureChest-0.png",
              true
            );
          }
          if (height < 0)
            this.cameras.main.zoom -= +this.numColsInput.value * 0.025;
          if (height > 0)
            this.cameras.main.zoom += +this.numColsInput.value * 0.025;
          this.createLevel();
        }
      });

    this.events.on("shutdown", (event) => {
      this.resizeDialog.classList.add("d-none");
    });
  }

  zoom() {
    this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      if (deltaY > 0) {
        var zoom = this.cameras.main.zoom - 0.05;
        if (zoom > 0.5) this.cameras.main.zoom -= 0.05;
      }
      if (deltaY < 0) {
        var zoom = this.cameras.main.zoom + 0.05;
        if (zoom < 1.5) this.cameras.main.zoom = zoom;
      }
    });
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
      this.laser.setPosition(this.objectX, this.objectY);
      this.chest.setPosition(this.objectX, this.objectY + 100);

      while (this.tiles.length > numTiles) {
        this.tiles.pop()?.destroy();
      }
    } else if (numTiles > this.tiles.length) {
      this.laser.setPosition(this.objectX, this.objectY);
      this.chest.setPosition(this.objectX, this.objectY + 100);

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

  ocultar() {
    this.laser.destroy();
  }
}
