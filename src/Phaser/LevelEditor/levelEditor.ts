import Phaser from 'phaser';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript'
import customBlocks from './Blockly/customBlocks';
import toolbox from './Blockly/toolbox';
import { defineBlocks } from './Blockly/Block_Code';

const TILE_WIDTH = 100;
const TILE_HEIGHT = 100;
const INIT_TILES = 3;
export default class LevelEditor extends Phaser.Scene {
    workspace: Blockly.WorkspaceSvg;
    blocklyArea = <HTMLElement>document.getElementById('blocklyArea');
    blocklyDiv = <HTMLElement>document.getElementById('blocklyDiv');
    dropZones: Phaser.GameObjects.Zone[][];

    constructor() {
        super('LevelEditor');
    }

    preload(): void {
        this.load.image('tileAsset', 'assets/Tiles/tile.png');
        this.load.image('Turret', 'assets/LaserTurret.png');
    }

    generateLevel(dimX: number, dimY: number, tileValue: number): number[][] {
        //create 2d array to hold the level data
        let level: number[][] = [];
        for (let i = 0; i < dimX; i++) {
            let row: number[] = [];
            for (let j = 0; j < dimY; j++) {
                row.push(tileValue);
            }
            level.push(row);
        }
        console.log(level);
        return level;
    }

    create() {
        var turret = this.add.sprite(100, 100, 'Turret');
        turret.setInteractive();
        const targetWidth = 200;
        const targetHeight = 200;
        const scaleFactor = Math.min(targetWidth / turret.width, targetHeight / turret.height);
        turret.setScale(scaleFactor);

        // Enable drag behavior for the sprite
        this.input.setDraggable(turret);

        // Define what happens when the sprite is dragged
        this.input.on('drag', (pointer, gameObject, dragX, dragY) => {
            gameObject.x = dragX;
            gameObject.y = dragY;
        });
        this.loadBlockly();
        // Load a map from a 2D array of tile indices
        // const level = this.generateLevel(dimX, dimY, 0);
        let level = this.generateLevel(INIT_TILES, INIT_TILES, 0);
        // Varibles to center the tilemap
        const SCREEN_X = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const SCREEN_Y = this.cameras.main.worldView.y + this.cameras.main.height / 2;
        // When loading from an array, make sure to specify the tileWidth and tileHeight
        let map = this.make.tilemap({ data: level, tileWidth: TILE_WIDTH, tileHeight: TILE_HEIGHT });

        let tiles = map.addTilesetImage('tileAsset')!;
        let layer = map.createLayer(0, tiles, SCREEN_X - (INIT_TILES / 2 * TILE_WIDTH), SCREEN_Y - (INIT_TILES / 2 * TILE_HEIGHT))!;
       // this.createDropZones(layer);
        document.getElementById("resize")?.addEventListener("click", e => {

            //get values from input fields into variables:
            let dimX = parseInt((<HTMLInputElement>document.getElementById("dimX")).value, 10);
            let dimY = parseInt((<HTMLInputElement>document.getElementById("dimY")).value, 10);
            let tileValue = 0;
            //if values are not empty, generate level with given values:
            if (dimX > 0 && dimY > 0) {
                level = this.generateLevel(dimX, dimY, tileValue);
                map.destroy();

                map = this.make.tilemap({ data: level, tileWidth: TILE_WIDTH, tileHeight: TILE_HEIGHT });
                tiles = map.addTilesetImage('tileAsset')!;
                layer = map.createLayer(0, tiles, SCREEN_X - (dimY / 2 * TILE_WIDTH), SCREEN_Y - (dimX / 2 * TILE_HEIGHT))!;
                this.createDropZones(layer);
            }
        });
    }


    createDropZones(layer: Phaser.Tilemaps.TilemapLayer) {
        this.dropZones = [];
        layer.forEachTile((tile, indexX, indexY) => {
            let zone = this.add.zone(tile.getCenterX(), tile.getCenterY(), TILE_WIDTH, TILE_HEIGHT).setOrigin(0.5);
            zone.setData('x', indexX);
            zone.setData('y', indexY);
            zone.setData('tile', tile);
            zone.setData('color', 0x00ffff);
            zone.setData('border', this.add.rectangle(zone.x, zone.y, TILE_WIDTH, TILE_HEIGHT, zone.getData('color')).setOrigin(0));
            if (!this.dropZones[indexX]) {
                this.dropZones[indexX] = [];
            }
            this.dropZones[indexX][indexY] = zone;
        });

    }

    loadBlockly() {
        Blockly.defineBlocksWithJsonArray(customBlocks);
        defineBlocks();

        this.workspace = Blockly.inject(this.blocklyDiv, { toolbox });

        const localBlocklyDiv = this.blocklyDiv;
        const localBlocklyArea = this.blocklyArea;
        const localWorkspace = this.workspace;

        const onresize = function () {
            // Compute the absolute coordinates and dimensions of blocklyArea.
            let element = localBlocklyArea;
            let x = 0;
            let y = 0;
            do {
                x += element.offsetLeft;
                y += element.offsetTop;
                element = <HTMLElement>element.offsetParent;
            } while (element);
            // Position blocklyDiv over blocklyArea.
            localBlocklyDiv.style.left = x + 'px';
            localBlocklyDiv.style.top = y + 'px';
            localBlocklyDiv.style.width = localBlocklyArea.offsetWidth + 'px';
            localBlocklyDiv.style.height = localBlocklyArea.offsetHeight + 'px';
            Blockly.svgResize(localWorkspace);
        };
        window.addEventListener('resize', onresize, false);
        onresize(); 
    }
}