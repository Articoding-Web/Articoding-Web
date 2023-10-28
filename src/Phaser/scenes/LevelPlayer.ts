import * as Phaser from "phaser";
import config from "../config";

import { Player } from "../Classes/Player";
import { GridPhysics } from "../Classes/GridPhysics";
import { Direction } from "../types/Direction";

export default class LevelPlayer extends Phaser.Scene {
  private mapCoordX : number;
  private mapCoordY : number;
  private tilemap: Phaser.Tilemaps.Tilemap;
  private player : Player;
  private gridPhysics : GridPhysics;

  constructor() {
    super("LevelPlayer");
  }

  // TODO pasar la información del nivel
  init() { }

  preload() {
    console.log("Preload");
    this.load.image("tiles", "assets/Dungeon_Tileset.png");
    this.load.tilemapTiledJSON("5x5map", "assets/5x5_map.json");

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
    console.log("Create");
    this.createTileMap();

    const playerSprite = this.add.sprite(0, 0, "player", "down/0.png");
    playerSprite.setDepth(2);
    this.cameras.main.roundPixels = true;

    this.gridPhysics = new GridPhysics(this.tilemap);
    this.player = new Player(playerSprite, this.gridPhysics, new Phaser.Math.Vector2(1, 1), this.mapCoordX, this.mapCoordY);

    this.createPlayerAnimation(Direction.UP);
    this.createPlayerAnimation(Direction.RIGHT);
    this.createPlayerAnimation(Direction.DOWN);
    this.createPlayerAnimation(Direction.LEFT);

    // onclick en vez de addEventListener porque las escenas no se cierran bien y el event listener no se elimina...
    let runCodeBtn = <HTMLElement>document.getElementById("runCodeBtn");
    runCodeBtn.onclick = (ev: MouseEvent) => this.runCode();

    this.events.on('shutdown', () => {
      console.log("Scene shutdown");
      this.textures.remove('tiles');
      this.textures.remove('player');
      this.textures.remove('BigTreasureChest');
      this.anims.remove(Direction.UP);
      this.anims.remove(Direction.RIGHT);
      this.anims.remove(Direction.DOWN);
      this.anims.remove(Direction.LEFT);
    });
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
    this.player.update(delta);
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
