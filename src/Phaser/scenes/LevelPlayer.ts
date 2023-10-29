import * as Phaser from "phaser";
import config from "../config";

import { Player } from "../Classes/Player";
import { GridPhysics } from "../Classes/GridPhysics";
import { Direction } from "../types/Direction";

export default class LevelPlayer extends Phaser.Scene {
  private mapCoordX: number;
  private mapCoordY: number;
  private scaleFactor: number;
  private tilemap: Phaser.Tilemaps.Tilemap;
  private players: Player[] = [];
  private gridPhysics: GridPhysics;
  private interactablesLayer: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super("LevelPlayer");
  }

  // TODO pasar la información del nivel
  init() { }

  preload() {
    console.log("Preload");
    this.load.image("tiles", "assets/Dungeon_Tileset.png");
    this.load.tilemapTiledJSON("4x4map", "assets/4x4_map.json");

    // Load frog
    this.load.multiatlas(
      "playerSprite",
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
    console.log("Create");
    this.zoom();
    this.createTileMap();
    this.createPlayers();
  }

  createTileMap() {
    this.tilemap = this.make.tilemap({ key: "4x4map" });
    this.tilemap.addTilesetImage("Dungeon_Tileset", "tiles");
    this.tilemap.addTilesetImage("FrogSpriteSheet", "playerSprite");

    const layerWidth = this.tilemap.width * config.TILE_SIZE;
    const layerHeight = this.tilemap.height * config.TILE_SIZE;

    this.scaleFactor = Math.floor((this.cameras.main.height) / layerHeight / 2);

    this.mapCoordX = (this.cameras.main.width - layerWidth * this.scaleFactor) / 2;
    this.mapCoordY = (this.cameras.main.height - layerHeight * this.scaleFactor) / 2;

    for (let i = 0; i < this.tilemap.layers.length; i++) {
      const layer = this.tilemap.createLayer(i, ["Dungeon_Tileset", "FrogSpriteSheet"], this.mapCoordX, this.mapCoordY);
      layer.scale = this.scaleFactor;
      if(i == 2){
        this.interactablesLayer = layer;
        // Create collisions for interactable objects
        console.log(this.interactablesLayer.setTileIndexCallback(85, this.interact, this));
      }
      layer.setDepth(i);
    }
  }

  createPlayers(){
    this.gridPhysics = new GridPhysics(this.tilemap, this.scaleFactor);
    // Create sprites
    const sprites = this.tilemap.createFromTiles(101, null, { key: "playerSprite", frame: "down/0.png" }, this, undefined, "Players");

    let i = 0;
    // Destroy each tile and position sprites correctly
    this.tilemap.forEachTile(tile => {
      const layer = tile.tilemapLayer;
      const sprite = sprites[i];
      sprite.setDepth(layer.depth);
      const offsetX = config.TILE_SIZE / 2 * this.scaleFactor  + this.mapCoordX;
      const offsetY = config.TILE_SIZE * this.scaleFactor  + this.mapCoordY;

      sprite.setOrigin(0.5, 1);
      sprite.setPosition(
        tile.x * config.TILE_SIZE * this.scaleFactor + offsetX,
        tile.y * config.TILE_SIZE * this.scaleFactor + offsetY
      );
      sprite.scale = this.scaleFactor;

      this.physics.add.existing(sprite);
      this.physics.add.overlap(sprite, this.interactablesLayer);

      // Create player
      this.players.push(new Player(sprite, this.gridPhysics, new Phaser.Math.Vector2(tile.x, tile.y), this.scaleFactor));
      layer.removeTileAt(tile.x, tile.y);

      i++;
    }, undefined, 1, 1, undefined, undefined, { isNotEmpty: true }, "Players");

    this.cameras.main.roundPixels = true;

    this.createPlayerAnimation(Direction.UP);
    this.createPlayerAnimation(Direction.RIGHT);
    this.createPlayerAnimation(Direction.DOWN);
    this.createPlayerAnimation(Direction.LEFT);

    // onclick en vez de addEventListener porque las escenas no se cierran bien y el event listener no se elimina...
    let runCodeBtn = <HTMLElement>document.getElementById("runCodeBtn");
    runCodeBtn.onclick = (ev: MouseEvent) => this.runCode();
  }

  createPlayerAnimation(
    name: string,
  ) {
    this.anims.create({
      key: name,
      frames: this.anims.generateFrameNames("playerSprite", {
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

  interact(){
    console.log("Hit interactable obj");
  }

  public update(_time: number, delta: number) {
    for (let p in this.players) {
      this.players[p].update(delta);
    }
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
    const code = globalThis.blocklyController.getCode();
    console.log(`runcode is gonna run: ${code}`);
    eval(code);
  }

  move(steps: number, direction: string) {
    this.events.emit('runCode', steps, Direction[direction]);
  }
}
