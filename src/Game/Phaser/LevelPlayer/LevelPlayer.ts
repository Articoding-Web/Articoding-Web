import * as Phaser from "phaser";
import config from "../../config.js";

import { Player } from "./Classes/Player.js";
import { GridPhysics } from "./Classes/GridPhysics.js";
import { Direction } from "./types/Direction.js";
import ChestObject from "./Classes/ChestObject.js";
import TrapObject from "./Classes/TrapObject.js";
import ArticodingSprite from "./Classes/ArticodingSprite.js";

export default class LevelPlayer extends Phaser.Scene {
  private theme: String;
  private height: number;
  private width: number;

  private backgroundLayerJson: any;
  private playersLayerJson: any;
  private objectsLayerJson: any;

  private tilemap: Phaser.Tilemaps.Tilemap;
  private mapCoordX: number;
  private mapCoordY: number;
  private scaleFactor: number;

  private players: Player[] = [];
  private objects: ArticodingSprite[] = [];

  private gridPhysics: GridPhysics;

  constructor() {
    super("LevelPlayer");
  }

  init(...params) {
    const levelJson = params[0];
    this.theme = levelJson.theme;
    this.height = levelJson.height;
    this.width = levelJson.width;
    this.backgroundLayerJson = levelJson.layers.background;
    this.playersLayerJson = levelJson.layers.players;
    this.objectsLayerJson = levelJson.layers.objects;
  }

  preload() {
    // Load background assets
    this.loadAssetFromLayer(this.backgroundLayerJson);

    // Load player assets
    this.loadAssetFromLayer(this.playersLayerJson);

    // Load objects assets
    for (let x in this.objectsLayerJson) {
      let objJson = this.objectsLayerJson[x];
      this.loadAssetFromLayer(objJson);
    }
  }

  loadAssetFromLayer(layerJson: any) {
    const themePath = `assets/sprites/${this.theme}`;

    const assetKey = layerJson.spriteSheet;
    if (layerJson.spriteSheetType === "multi") {
      this.load.multiatlas(
        assetKey,
        `${themePath}/${assetKey}.json`,
        themePath
      );
    } else {
      this.load.image(assetKey, `${themePath}/${assetKey}.png`);
    }
  }

  create() {
    // this.zoom();
    this.createBackground(); // create un tilemap
    this.createPlayers(); // create sprites y obj jugadores
    this.createObjects(); // create sprites obj, incl. cofres

    document.addEventListener("execution-finished", () => {
      this.checkWinCondition();
    })
  }

  createBackground() {
    this.tilemap = this.make.tilemap({
      tileWidth: config.TILE_SIZE,
      tileHeight: config.TILE_SIZE,
      width: this.width,
      height: this.height,
    });

    const layerWidth = this.tilemap.width * config.TILE_SIZE;
    const layerHeight = this.tilemap.height * config.TILE_SIZE;

    this.scaleFactor = Math.floor(this.cameras.main.height / layerHeight / 2);

    this.mapCoordX =
      (this.cameras.main.width - layerWidth * this.scaleFactor) / 2;
    this.mapCoordY =
      (this.cameras.main.height - layerHeight * this.scaleFactor) / 2;

    this.tilemap.addTilesetImage(this.backgroundLayerJson.spriteSheet);
    const layer = this.tilemap.createBlankLayer(
      this.backgroundLayerJson.spriteSheet,
      this.tilemap.tilesets,
      this.mapCoordX,
      this.mapCoordY
    );
    layer.scale = this.scaleFactor;
    layer.depth = this.backgroundLayerJson.depth || layer.depth;

    for (let y in this.backgroundLayerJson.objects) {
      const obj = this.backgroundLayerJson.objects[y];
      const tile = this.tilemap.putTileAt(obj.spriteIndex || 0, obj.x, obj.y);
      if (tile)
        tile.properties = obj.properties;
    }
  }

  createPlayers() {
    this.gridPhysics = new GridPhysics(this.tilemap, this.scaleFactor, this.objects);

    // Create sprites
    for (let x in this.playersLayerJson.objects) {
      const player = this.playersLayerJson.objects[x];

      // Create and scale sprite
      const sprite = this.add.sprite(player.x, player.y, this.playersLayerJson.spriteSheet);
      this.scaleSprite(sprite, player.x, player.y);
      sprite.setDepth(this.playersLayerJson.depth);

      // Add physics and create player object
      this.physics.add.existing(sprite);
      this.players.push(
        new Player(sprite, this.gridPhysics, new Phaser.Math.Vector2(parseInt(player.x), parseInt(player.y)), this.scaleFactor)
      );
    }

    this.cameras.main.roundPixels = true;

    this.createPlayerAnimation(Direction.UP);
    this.createPlayerAnimation(Direction.RIGHT);
    this.createPlayerAnimation(Direction.DOWN);
    this.createPlayerAnimation(Direction.LEFT);
    this.createDyingAnimation();
  }

  createPlayerAnimation(name: string) {
    this.anims.create({
      key: name,
      frames: this.anims.generateFrameNames("player", {
        start: 0,
        end: 3,
        prefix: `${name}/`,
        suffix: ".png",
      }),
      frameRate: 8,
      repeat: -1,
      yoyo: true,
    });
  }

  createDyingAnimation() {
    this.anims.create({
      key: 'dying',
      frameRate: 10,
      repeat: -1
    });
  }

  createObjects() {
    for (let x in this.objectsLayerJson) {
      const objectJson = this.objectsLayerJson[x];
      const objects = objectJson.objects;
      for (let y in objects) {
        const obj = objects[y];

        if (obj.type === "chest") {
          const chest = new ChestObject(
            this,
            obj.x,
            obj.y,
            objectJson.spriteSheet
          );
          this.scaleSprite(chest, obj.x, obj.y);
          chest.setDepth(objectJson.depth);
          this.objects.push(chest);
        } else if (obj.type === "trap") {
          this.createTrapAnim();
          const trap = new TrapObject(this, obj.x, obj.y, objectJson.spriteSheet);
          this.scaleSprite(trap, obj.x, obj.y);
          trap.setDepth(objectJson.depth);
          if (obj.properties.enabled)
            trap.enable();
          this.objects.push(trap);
        }
        else {
          // Create and scale sprite
          const sprite = this.add.sprite(obj.x, obj.y, objectJson.spriteSheet);
          this.scaleSprite(sprite, obj.x, obj.y);
          sprite.setDepth(objectJson.depth);
        }
      }
    }
  }

  createTrapAnim() {
    this.anims.create({
      key: "trap",
      frames: this.anims.generateFrameNames("trap", {
        start: 0,
        end: 3,
        suffix: '.png',
      }),
      frameRate: 8,
    });
  }

  scaleSprite(
    sprite: Phaser.GameObjects.Sprite,
    gridXPosition: number,
    gridYPosition: number
  ) {
    const offsetX = (config.TILE_SIZE / 2) * this.scaleFactor + this.mapCoordX;
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

  checkWinCondition(): void {
    for (let x in this.players) {
      const player = this.players[x];
      if (!player.getIsAlive() || !player.hasCollectedChest()) {
        player.die();
        const event = new CustomEvent("winConditionModal", { detail: { msg: "Lose", stars: 0, status: 0 } });
        document.dispatchEvent(event);
        return;
      }
    }

    const event = new CustomEvent("winConditionModal", { detail: { msg: "Win", stars: 3, status: 1 } });
    document.dispatchEvent(event);
  }

  rotate(direction: string) {
    this.events.emit("rotateOrder", Direction[direction]);
  }
}
