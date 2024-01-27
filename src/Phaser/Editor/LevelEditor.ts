import * as Phaser from "phaser";
import EditorBoard from "./Classes/EditorBoard";
import config from "../config";
import ArticodingObject from "./Classes/ArticodingObject";

// TODO: eliminar magic numbers
const NUM_ROWS = 5;
const NUM_COLS = 5;

export default class LevelEditor extends Phaser.Scene {
  board: EditorBoard;
  public scaleFactor: number;
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

    // TODO: load level or default assets

  }

  create(): void {
    const layerWidth = NUM_COLS * config.TILE_SIZE;
    const layerHeight = NUM_ROWS * config.TILE_SIZE;

    this.scaleFactor = Math.floor((this.cameras.main.height) / layerHeight / 2);
    const mapCoordX = (this.cameras.main.width - layerWidth * this.scaleFactor) / 2;
    const mapCoordY = (this.cameras.main.height - layerHeight * this.scaleFactor) / 2;

    this.board = new EditorBoard(this, mapCoordX, mapCoordY, NUM_ROWS, NUM_COLS);

    // TESTING
    const chest = new ArticodingObject(
      this,
      100,
      100,
      "chest",
      0,
      false
    );
  }
}
