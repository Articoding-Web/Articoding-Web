import * as Phaser from "phaser";
import EditorBoard from "./Classes/EditorBoard";
import config from "../config";
import ArticodingObject from "./Classes/ArticodingObject";

// TODO: eliminar magic numbers
const NUM_ROWS = 5;
const NUM_COLS = 5;

export default class LevelEditor extends Phaser.Scene {
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

    // TODO: load level or default assets

  }

  create(): void {
    this.board = new EditorBoard(this, NUM_ROWS, NUM_COLS);

    // TESTING
    const chest = new ArticodingObject(
      this,
      100,
      100,
      this.board.getScaleFactor(),
      "chest",
      0,
      false
    );
  }
}
