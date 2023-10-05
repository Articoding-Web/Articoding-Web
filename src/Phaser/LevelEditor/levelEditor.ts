import Phaser from 'phaser';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript'
import customBlocks from './Blockly/customBlocks';
import toolbox from './Blockly/toolbox';
import { defineBlocks } from './Blockly/Block_Code';

const TILE_SIZE = 100;
const INIT_TILES = 3;
const TURRET_START_POS_X = 100;
const TURRET_START_POS_Y = 100;

export default class LevelEditor extends Phaser.Scene {
    workspace: Blockly.WorkspaceSvg;
    blocklyArea = <HTMLElement>document.getElementById('blocklyArea');
    blocklyDiv = <HTMLElement>document.getElementById('blocklyDiv');
    numTilesX: number;
    numTilesY: number;
    tiles: Phaser.GameObjects.Sprite[] = [];
    turret: Phaser.GameObjects.Sprite;

    constructor() {
        super('LevelEditor');
    }

    preload(): void {
        this.load.image('tile', 'assets/Tiles/tile.png');
        this.load.image('Turret', 'assets/LaserTurret.png');
    }

    generateLevel(): void {
        console.debug("Generating level:");
        console.debug(`numTiles: ${this.tiles.length}`);

        // Varibles to center the tilemap
        const SCREEN_X = this.cameras.main.width;
        const SCREEN_Y = this.cameras.main.height;
        let xCoord = (SCREEN_X - (this.numTilesX * TILE_SIZE)) / 2
        let yCoord = (SCREEN_Y - (this.numTilesY * TILE_SIZE)) / 2

        let newTotalNumTiles = this.numTilesX * this.numTilesY;
        console.debug(`newTotalNumTiles: ${newTotalNumTiles}`);

        if (newTotalNumTiles < this.tiles.length) {
            // reset turret pos
            this.turret.setPosition(TURRET_START_POS_X, TURRET_START_POS_Y);

            // remove tiles
            while (this.tiles.length > newTotalNumTiles) {
                console.debug("Destroying");
                this.tiles.pop()?.destroy();
            }
        } else if (newTotalNumTiles > this.tiles.length) {
            // reset turret pos
            this.turret.setPosition(TURRET_START_POS_X, TURRET_START_POS_Y);
            
            // add new tiles
            while (this.tiles.length < newTotalNumTiles) {
                console.debug("Creating");
                const tile = this.add.sprite(0, 0, 'tile').setInteractive();
                tile.input!.dropZone = true;
                this.tiles.push(tile);
            }
        }

        this.tiles = Phaser.Actions.GridAlign(this.tiles, {
            width: this.numTilesX,
            height: this.numTilesY,
            cellWidth: TILE_SIZE,
            cellHeight: TILE_SIZE,
            x: xCoord,
            y: yCoord
        });
    }

    create() {
        this.createTurret();
        this.loadBlockly();

        if (this.numTilesX == undefined)
            this.numTilesX = INIT_TILES;
        if (this.numTilesY == undefined)
            this.numTilesY = INIT_TILES;

        this.generateLevel();

        this.setDragEvents();

        // Add a collider to the map (used for several things, such as the player)
        // map.setCollisionByExclusion([-1]);
        document.getElementById("resize")?.addEventListener("click", e => {
            // TODO: get x, y values from inside phaser
            this.numTilesX = parseInt((<HTMLInputElement>document.getElementById("dimX")).value, 10);
            this.numTilesY = parseInt((<HTMLInputElement>document.getElementById("dimY")).value, 10);

            this.generateLevel();
        });
    }

    setDragEvents(){
        this.input.on('dragenter', (pointer, gameObject, dropZone) => {
            dropZone.setTint(0x00ff00);
        });

        this.input.on('dragleave', (pointer, gameObject, dropZone) => {
            dropZone.clearTint();
        });

        this.input.on('drop', (pointer, gameObject, dropZone) => {
            gameObject.x = dropZone.x;
            gameObject.y = dropZone.y;

            dropZone.clearTint();
        });
    }

    createTurret() {
        this.turret = this.add.sprite(TURRET_START_POS_X, TURRET_START_POS_Y, 'Turret');
        this.turret.setInteractive();
        const targetWidth = 200;
        const targetHeight = 200;
        const scaleFactor = Math.min(targetWidth / this.turret.width, targetHeight / this.turret.height);
        this.turret.setScale(scaleFactor);

        // Enable drag behavior for the sprite
        this.input.setDraggable(this.turret);

        this.input.on('dragstart', function (pointer, gameObject) {
            this.children.bringToTop(gameObject);
        }, this);

        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
    }

    loadBlockly() {
        Blockly.defineBlocksWithJsonArray(customBlocks);
        defineBlocks();

        this.workspace = Blockly.inject(this.blocklyDiv, { toolbox });
        document.getElementById("play")?.addEventListener("click", e => this.log());

        window.addEventListener('resize', this.blocklyResize, false);
        this.blocklyResize();
    }

    blocklyResize() {
        // Compute the absolute coordinates and dimensions of blocklyArea.
        let element = this.blocklyArea;
        let x = 0;
        let y = 0;
        do {
            x += element.offsetLeft;
            y += element.offsetTop;
            element = <HTMLElement>element.offsetParent;
        } while (element);
        // Position blocklyDiv over blocklyArea.
        this.blocklyDiv.style.left = x + 'px';
        this.blocklyDiv.style.top = y + 'px';
        this.blocklyDiv.style.width = this.blocklyArea.offsetWidth + 'px';
        this.blocklyDiv.style.height = this.blocklyArea.offsetHeight + 'px';
        Blockly.svgResize(this.workspace);
    }

    log() {
        console.log(javascriptGenerator.workspaceToCode(this.workspace));
        console.log("here");
    }
}