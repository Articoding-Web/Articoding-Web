import * as Phaser from "phaser";
import config from "../config";

import { Player } from "../Classes/Player";
import { GridPhysics } from "../Classes/GridPhysics";
import { Direction } from "../types/Direction";

const INTERACTABLES_LAYER = 2;
const CHEST_SPRITE_INDEX = 85;
const SPIKES_SPRITE_INDEX = 113;
const PLAYER_SPRITE_INDEX = 101;

const MULTIATLAS_NAMES = ["background", "player", "trap", "door"];

export default class LevelPlayer extends Phaser.Scene {
  private theme: String;
  private height: number;
  private width: number;
  private objetsJson: JSON;

  private mapCoordX: number;
  private mapCoordY: number;
  private scaleFactor: number;
  private tilemap: Phaser.Tilemaps.Tilemap;
  private players: Player[] = [];
  private traps: Phaser.GameObjects.Sprite[] = [];
  private gridPhysics: GridPhysics;
  private interactablesLayer: Phaser.Tilemaps.TilemapLayer;

  constructor() {
    super("LevelPlayer");
  }

  // TODO pasar la información del nivel
  init(...params) {
    const levelJson = params[0];
    this.theme = levelJson.theme;
    this.height = levelJson.height;
    this.width = levelJson.width;
    this.objetsJson = levelJson.objects;
  }

  preload() {
    this.loadAssets();
  }

  loadAssets(){
    const themePath = `assets/sprites/${this.theme}`;

    // Load multiatlases
    for(let x in MULTIATLAS_NAMES){
      let assetKey : string = MULTIATLAS_NAMES[x];
      this.load.multiatlas(
        assetKey,
        `${themePath}/${assetKey}.json`,
        themePath
      );
    }

    // Other assets

    // wall / blockable
    this.load.image("wall", `${themePath}/wall.png`);
    // chest / objective
    this.load.image("chest", `${themePath}/chest.png`);
  }

  create() {
    // this.zoom();
    this.createTileMap();
    // this.createPlayers();
  }

  createTileMap() {
    this.tilemap = this.make.tilemap({ tileWidth: config.TILE_SIZE, tileHeight: config.TILE_SIZE, width: this.width, height: this.height});
    this.tilemap.addTilesetImage("background");

    const layerWidth = this.tilemap.width * config.TILE_SIZE;
    const layerHeight = this.tilemap.height * config.TILE_SIZE;

    this.scaleFactor = Math.floor((this.cameras.main.height) / layerHeight / 2);

    this.mapCoordX = (this.cameras.main.width - layerWidth * this.scaleFactor) / 2;
    this.mapCoordY = (this.cameras.main.height - layerHeight * this.scaleFactor) / 2;

    // {data: [], tileWidth: config.TILE_SIZE, tileHeight: config.TILE_SIZE, }
    const bgLayer = this.tilemap.createBlankLayer("background", this.tilemap.tilesets, this.mapCoordX, this.mapCoordY);
    bgLayer.scale = this.scaleFactor;

    // Outer ring
    this.tilemap.putTileAt(0, 0, 0);  // Top-Left corner
    this.tilemap.randomize(1, 0, this.width - 2, 1, [1, 2, 3]);   // Top between corners
    this.tilemap.putTileAt(4, this.width - 1, 0); // Top-Right corner

    this.tilemap.randomize(0, 1, 1, this.height - 2, [5, 10, 15]);  // Left border
    this.tilemap.randomize(this.width - 1, 1, 1, this.height - 2, [9, 14, 19]); // Right border

    this.tilemap.putTileAt(20, 0, this.height - 1); // Bottom-Left corner
    this.tilemap.randomize(1, this.height - 1, this.width - 2, 1, [21, 22, 23]); // Bottom between corners
    this.tilemap.putTileAt(24, this.width - 1, this.height - 1); // Bottom-Right corner

    // Inner ring
    this.tilemap.putTileAt(6, 1, 1);  // Top-Left corner
    this.tilemap.fill(7, 2, 1, this.width - 3, 1);   // Top between corners
    this.tilemap.putTileAt(8, this.width - 2, 1); // Top-Right corner

    this.tilemap.fill(11, 1, 2, 1, this.height - 3);  // Left border
    this.tilemap.fill(13, this.width - 2, 2, 1, this.height - 3); // Right border

    this.tilemap.putTileAt(16, 1, this.height - 2); // Bottom-Left corner
    this.tilemap.fill(17, 2, this.height - 2, this.width - 3, 1); // Bottom between corners
    this.tilemap.putTileAt(18, this.width - 2, this.height - 2); // Bottom-Right corner

    // Inside
    this.tilemap.fill(12, 2, 2, (this.width - 3) / 2, (this.height - 3) / 2);
  }

  createTraps() {
    this.createTrapAnimation();
    
  }

  createTrapAnimation() {
    this.anims.create({
      key: "trap",
      frames: this.anims.generateFrameNames("trap", {
        start: 0,
        end: 3,
        suffix: '.png',
      }),
      frameRate: 2,
      repeat: -1,
      yoyo: true,
    });
  }

  createPlayers() {
    this.gridPhysics = new GridPhysics(this.tilemap, this.scaleFactor);
    // Create sprites
    const sprites = this.tilemap.createFromTiles(PLAYER_SPRITE_INDEX, null, { key: "playerSprite", frame: "down/0.png" }, this, undefined, "Players");

    let i = 0;
    // Destroy each tile and position sprites correctly
    this.tilemap.forEachTile(tile => {
      const layer = tile.tilemapLayer;
      const sprite = sprites[i];
      sprite.setDepth(layer.depth);

      this.scaleSprite(sprite, tile.x, tile.y);

      this.physics.add.existing(sprite);
      this.physics.add.overlap(sprite, this.interactablesLayer);

      this.physics.add.collider(sprite, this.traps, this.trapCollider);

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
      frameRate: 8,
      repeat: -1,
      yoyo: true,
    });
  };

  trapCollider(player, trap) {
    console.log(`Player ${player} collided with trap ${trap}`);
  }

  chestCollider() {
    console.log("Hit interactable obj");
  }

  scaleSprite(sprite: Phaser.GameObjects.Sprite, gridXPosition: number, gridYPosition: number) {
    const offsetX = config.TILE_SIZE / 2 * this.scaleFactor + this.mapCoordX;
    const offsetY = config.TILE_SIZE * this.scaleFactor + this.mapCoordY;

    sprite.setOrigin(0.5, 1);
    sprite.setPosition(
      gridXPosition * config.TILE_SIZE * this.scaleFactor + offsetX,
      gridYPosition * config.TILE_SIZE * this.scaleFactor + offsetY
    );
    sprite.scale = this.scaleFactor;
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

  runCode() { // solo para testear? 
    const codeInstructions = globalThis.blocklyController.fetchCode();
    for (let instruction in codeInstructions) {
      eval(codeInstructions[instruction]);
    }
  }
  //IDEA PARA EVENTQUEUE (PENDIENTE DE IMPLEMENTAR)
  // private eventQueue: any[] = [];

  // runCode() {
  //   const codeInstructions = globalThis.blocklyController.fetchCode();
  //   for(let instruction in codeInstructions){
  //     this.eventQueue.push(codeInstructions[instruction]);
  //   }
  // }
  // emitNextEvent() {
  //   const nextEvent = this.eventQueue.shift();
  //   if (nextEvent) {
  //     eval(nextEvent);
  //     this.emitNextEvent();
  //   }
  // }



  move(steps: number, direction: string) {
    this.events.emit('moveOrder', steps, Direction[direction]);
  }

  rotate(direction: string) {
    this.events.emit('rotateOrder', Direction[direction]);
  }
  //NO TOCAR (tal vez sea util)
  // rotate(steps: number, direction: string) {
  //   const rotation = direction === 'left' ? -1 : 1;
  //   for (let i = 0; i < steps; i++) {
  //     this.players.forEach(player => {
  //       frog.rotate(rotation);
  //       const animName = Direction[player.direction];
  //       player.sprite.anims.play(animName, true);
  //     });
  //   }
  // }
}
