import * as Phaser from 'phaser';

import config from '../../config.js';
import ArticodingSprite from './Classes/ArticodingSprite.js';
import ChestObject from './Classes/ChestObject.js';
import ExitObject from './Classes/Exit.js';
import { GridPhysics } from './Classes/GridPhysics.js';
import { Player } from './Classes/Player.js';
import TrapObject from './Classes/TrapObject.js';
import { Direction } from './types/Direction.js';
import EnemyObject from './Classes/Enemy.js';
import loadLevelEditor from '../../../SPA/loaders/levelEditorLoader.js';
import Level from "../../level";
import PhaserController from '../../PhaserController.js';

// For saving levels
import { sessionCookieValue } from '../../../SPA/loaders/profileLoader';
import { fetchRequest } from '../../../SPA/utils';
const API_ENDPOINT = `${config.API_PROTOCOL}://${config.API_DOMAIN}:${config.API_PORT}/api`;

export default class LevelPlayer extends Phaser.Scene {
  private theme: String;
  private height: number;
  private width: number;

  private backgroundLayerJson: Level.Layer;
  private playersLayerJson: Level.Layer;
  private objectsLayers: Level.Layer[];

  private tilemap: Phaser.Tilemaps.Tilemap;
  private mapCoordX: number;
  private mapCoordY: number;
  private scaleFactor: number;

  private players: Player[] = [];
  private objects: ArticodingSprite[] = [];
  private numChests = 0;

  private gridPhysics: GridPhysics;

  private levelJSON: Level.Level;
  private fromLevelEditor: boolean;

  constructor() {
    super("LevelPlayer");
  }

  init(data: { levelJSON: Level.Level, fromLevelEditor?: boolean }) {
    this.levelJSON = data.levelJSON;
    this.fromLevelEditor = data.fromLevelEditor;

    const { theme, height, width, layers } = this.levelJSON.phaser;
    const { background, players, objects } = layers;
    
    this.theme = theme;
    this.height = height;
    this.width = width;
    this.backgroundLayerJson = background;
    this.playersLayerJson = players;
    this.objectsLayers = objects;    
  }

  preload() {
    // Load background assets
    this.loadAssetFromLayer(this.backgroundLayerJson);

    // Load player assets
    this.loadAssetFromLayer(this.playersLayerJson);

    // Load objects assets
    for (let x in this.objectsLayers) {
      let objJson = this.objectsLayers[x];
      this.loadAssetFromLayer(objJson);
    }
  }

  loadAssetFromLayer(layerJson: Level.Layer) {
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
    this.events.on('shutdown', this.shutdown, this);
    this.events.on('destroy', this.shutdown, this);
    
    document.getElementById("speedModifierBtn").addEventListener("click", this.changeAnimSpeed);
    document.getElementById("editButton").addEventListener("click", this.loadLevelEditor);

    // this.zoom();
    this.createBackground(); // create un tilemap
    this.createPlayers(); // create sprites y obj jugadores
    this.createObjects(); // create sprites obj, incl. cofres

    document.addEventListener("execution-finished", this.checkWinCondition);
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
      const obj = <Level.BackgroundTile>this.backgroundLayerJson.objects[y];
      const tile = this.tilemap.putTileAt(parseInt(obj.spriteIndex) || 0, obj.x, obj.y);
      if (tile) tile.properties = obj.properties;
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

      this.players.push(new Player(sprite, this.gridPhysics, new Phaser.Math.Vector2(player.x, player.y), this.scaleFactor));
    }

    this.cameras.main.roundPixels = true;

    this.createPlayerAnimation(Direction.UP);
    this.createPlayerAnimation(Direction.RIGHT);
    this.createPlayerAnimation(Direction.DOWN);
    this.createPlayerAnimation(Direction.LEFT);
    this.createDyingAnimation();
  }

  createPlayerAnimation(name: string) {
    if (!this.anims.exists(name)) {
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
  }

  createDyingAnimation() {
    if (!this.anims.exists("dying")) {
      this.anims.create({
        key: "dying",
        frameRate: 10,
        repeat: -1,
      });
    }
  }

  createObjects() {
    for (let x in this.objectsLayers) {
      const objectJson = this.objectsLayers[x];
      const objects = objectJson.objects;
      for (let y in objects) {
        const obj = <Level.ObjectTile>objects[y];

        let createdObject;
        if (obj.type === "chest") {
          createdObject = new ChestObject(this, obj.x, obj.y, objectJson.spriteSheet);
          this.numChests++;
        } else if (obj.type === "trap") {
          this.createTrapAnim();
          createdObject = new TrapObject(this, obj.x, obj.y, objectJson.spriteSheet);
          if (obj.properties.enabled) createdObject.enable();
        } else if (obj.type === "exit") {
          createdObject = new ExitObject(this, obj.x, obj.y, objectJson.spriteSheet);
        } else if (obj.type === "wall") {
          // TODO: add wall collisions
          const wall = this.add.sprite(obj.x, obj.y, objectJson.spriteSheet);
          this.scaleSprite(wall, obj.x, obj.y);
          wall.setDepth(objectJson.depth);
        } else if (obj.type === "enemy") {
          createdObject = new EnemyObject(this, obj.x, obj.y, objectJson.spriteSheet, obj.movementOrientation);
        }
        else {
          console.error("Object type not registered");
          console.error(obj.type);
          continue;
        }

        if (createdObject) {
          // TODO: ver si el if se puede quitar al crear objeto WALL
          this.scaleSprite(createdObject, obj.x, obj.y);
          createdObject.setDepth(objectJson.depth);
          this.objects.push(createdObject);
        }
      }
    }
  }

  createTrapAnim() {
    if (!this.anims.exists("trap")) {
      this.anims.create({
        key: "trap",
        frames: this.anims.generateFrameNames("trap", {
          start: 0,
          end: 3,
          suffix: ".png",
        }),
        frameRate: 8,
      });
    }
  }

  scaleSprite(sprite: Phaser.GameObjects.Sprite, gridXPosition: number, gridYPosition: number) {
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

  private checkWinCondition = async (e: Event) => {
    let hasLost = false;
    let playerBounced = false;

    for (let x in this.players) {
      const player = this.players[x];
      if (!player.getIsAlive() || !player.hasReachedExit()) {
        player.die();
        hasLost = true;
      } else if (player.getHasBounced()) {
        playerBounced = true;
      }

      this.numChests -= player.getCollectedChest();
    }
    
    if(!this.fromLevelEditor) {
      // Official Level
      let stars = 0;
      if (hasLost) {
        const event = new CustomEvent("lose");
        document.dispatchEvent(event);
      } else {
        stars = 1 + (!playerBounced && this.numChests === 0 ? 1 : 0) + 1; // TODO: minBlocks star
        const event = new CustomEvent("win", { detail: { stars } });
        document.dispatchEvent(event);
      }

      const statisticEvent = new CustomEvent("updateStatistic", { detail: { hasLost: hasLost, stars } });
      document.dispatchEvent(statisticEvent);
    } else {
      // From Level Editor
      const object = sessionCookieValue();
      if (object !== null) {
        if (window.confirm("Save Level?")) {
          const levelData = {
            user: object.id,
            category: null,
            self: null,
            title: "Editor",
            data: JSON.stringify(this.levelJSON),
            minBlocks: null,
            description: null,
          };
          console.log("Nivel:", levelData);
          await fetchRequest(`${API_ENDPOINT}/level/create`, "POST", JSON.stringify(levelData));
          alert("Nivel creado");
        }        
      } else alert("Necesitas iniciar sesión");
    }
  };

  private changeAnimSpeed = (e: Event) => {
    const val = parseInt((e.currentTarget as HTMLInputElement).value);
    const newVal = (val % 3) + 1;  // between 1 - 3

    (e.currentTarget as HTMLDivElement).innerHTML = `${newVal}x`;
    (e.currentTarget as HTMLInputElement).value = `${newVal}`;
  }

  private loadLevelEditor = async () => {
    await PhaserController.destroyGame();
    loadLevelEditor(this.levelJSON.phaser);
  }

  rotate(direction: string) {
    this.events.emit("rotateOrder", Direction[direction]);
  }

  shutdown() {
    document.removeEventListener("execution-finished", this.checkWinCondition);
    document.getElementById("speedModifierBtn").removeEventListener("click", this.changeAnimSpeed);
    if (this.fromLevelEditor)
      document.getElementById("editButton").removeEventListener("click", this.loadLevelEditor);

    while (this.players.length) {
      this.players.pop().destroy();
    }

    while (this.objects.length) {
      this.objects.pop().destroy();
    }
  }

  getGridPhysics(): GridPhysics {
    return this.gridPhysics;
  }

  getScaleFactor(): number {
    return this.scaleFactor;
  }
}
