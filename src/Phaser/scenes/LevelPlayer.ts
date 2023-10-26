import * as Phaser from "phaser";
import config from "../config";

import ArticodingObject from "../Classes/ArticodingObject";
import Board from "../Classes/Board";
import TileObject from "../Classes/TileObject";
import { Player } from "../Classes/Player";
import { GridControls } from "../Classes/GridControls";
import { GridPhysics } from "../Classes/GridPhysics";
import { Direction } from "../types/Direction";

export default class LevelPlayer extends Phaser.Scene {
  frog: ArticodingObject;
  chest: ArticodingObject;
  rows: integer;
  columns: integer;
  tiles: TileObject[];
  board: Board;

  private mapCoordX : number;
  private mapCoordY : number;
  private tilemap: Phaser.Tilemaps.Tilemap;
  private gridControls: GridControls;
  private gridPhysics: GridPhysics;

  constructor() {
    super("LevelPlayer");
  }

  // TODO pasar la información del nivel
  init() { }

  preload() {
    this.load.image("tiles", "assets/Dungeon_Tileset.png");
    this.load.tilemapTiledJSON("5x5map", "assets/5x5_map.json");

    // cargar el juego con el JSON
    this.tiles = [];
    this.rows = 3;
    this.columns = 3;

    // Load frog
    this.load.multiatlas(
      "player",
      "assets/sprites/FrogSpriteSheet.json",
      "assets/sprites/"
    );
    // Load chest
    this.load.multiatlas(
      "BigTreasureChest",
      "assets/sprites/BigTreasureChest.json",
      "assets/sprites/"
    );
    // Load tile
    this.load.image("tile", "assets/tiles/tile.png");
  }

  create() {
    this.createTileMap();

    const playerSprite = this.add.sprite(0, 0, "player", "down/0.png");
    playerSprite.setDepth(2);
    this.cameras.main.roundPixels = true;
    const player = new Player(playerSprite, new Phaser.Math.Vector2(1, 2), this.mapCoordX, this.mapCoordY);

    this.gridPhysics = new GridPhysics(player, this.tilemap);
    this.gridControls = new GridControls(this.input, this.gridPhysics);

    this.createPlayerAnimation(Direction.UP);
    this.createPlayerAnimation(Direction.RIGHT);
    this.createPlayerAnimation(Direction.DOWN);
    this.createPlayerAnimation(Direction.LEFT);
  }

  createPlayerAnimation(
    name: string,
  ) {
    this.anims.create({
      key: name,
      frames: this.anims.generateFrameNames("player", {
        start: 0,
        end: 3,
        prefix: `${name}/`,
        suffix: '.png',
      }),
      frameRate: 10,
      repeat: -1,
      yoyo: true,
    });
  };

  createTileMap() {
    this.tilemap = this.make.tilemap({ key: "5x5map" });
    this.tilemap.addTilesetImage("Dungeon_Tileset", "tiles");

    const layerWidth = this.tilemap.width * config.TILE_SIZE;
    const layerHeight = this.tilemap.height * config.TILE_SIZE;

    this.mapCoordX = (this.cameras.main.width - layerWidth) / 2;
    this.mapCoordY = (this.cameras.main.height - layerHeight) / 2;

    for (let i = 0; i < this.tilemap.layers.length; i++) {
      const layer = this.tilemap.createLayer(i, "Dungeon_Tileset", this.mapCoordX, this.mapCoordY);
      layer.setDepth(i);
    }
  }

  public update(_time: number, delta: number) {
    this.gridControls.update();
    this.gridPhysics.update(delta);
  }



  zoom(): void {
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

  runCode() {
    console.log("runcode is gonna run: ", globalThis.blocklyController.getCode());
    eval(globalThis.blocklyController.getCode());
  }

  // createLevel(): void {
  //   const SCREEN_WIDTH = this.cameras.main.width;
  //   const SCREEN_HEIGHT = this.cameras.main.height;
  //   let x = (SCREEN_WIDTH - this.rows * env.TILE_SIZE) / 2;
  //   let y = (SCREEN_HEIGHT - this.columns * env.TILE_SIZE) / 2;

  //   let numTiles = this.rows * this.columns;

  //   if (numTiles < this.tiles.length) {
  //     while (this.tiles.length > numTiles) {
  //       this.tiles.pop()?.destroy();
  //     }
  //   } else if (numTiles > this.tiles.length) {
  //     while (this.tiles.length < numTiles) {
  //       const tile = new TileObject(this, 0, 0, "tile");
  //       this.tiles.push(tile);
  //     }
  //   }

  //   this.tiles = Phaser.Actions.GridAlign(this.tiles, {
  //     width: this.rows,
  //     height: this.columns,
  //     cellWidth: env.TILE_SIZE,
  //     cellHeight: env.TILE_SIZE,
  //     x,
  //     y,
  //   });

  //   this.loadObjects();

  //   this.board.setTiles(this.tiles);
  // }

  // loadObjects() {
  //   this.frog = new ArticodingObject(
  //     this,
  //     // Primera casilla del tablero
  //     this.tiles[0].returnGlobalCoordinates().x,
  //     this.tiles[0].returnGlobalCoordinates().y,
  //     "FrogSpriteSheet",
  //     this.board,
  //     "down/SpriteSheet-02.png",
  //     false,
  //     false,
  //     false
  //   );

  //   this.tiles[0].addObject(this.frog);

  //   this.chest = new ArticodingObject(
  //     this,
  //     // Segunda casilla del tablero
  //     this.tiles[1].returnGlobalCoordinates().x,
  //     this.tiles[1].returnGlobalCoordinates().y,
  //     "BigTreasureChest",
  //     this.board,
  //     "BigTreasureChest-0.png",
  //     false,
  //     false,
  //     false
  //   );

  //   this.tiles[0].addObject(this.chest);
  // }
}
