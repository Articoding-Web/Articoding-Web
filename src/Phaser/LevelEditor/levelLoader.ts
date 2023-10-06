import Phaser from 'phaser';
import * as Blockly from 'blockly';
import { javascriptGenerator } from 'blockly/javascript'
import customBlocks from './Blockly/customBlocks';
import toolbox from './Blockly/toolbox';
import { defineBlocks } from './Blockly/Block_Code';



export default class LevelLoader extends Phaser.Scene {
    workspace: Blockly.WorkspaceSvg;
    blocklyArea = <HTMLElement>document.getElementById('blocklyArea');
    blocklyDiv = <HTMLElement>document.getElementById('blocklyDiv');
    map: Phaser.Tilemaps.Tilemap;
    TILE_SIZE = 100;

    constructor() {
        super('LevelEditor');
    }

    preload(): void {
        this.load.image('tile', 'assets/Tiles/tile.png');
        this.load.image('Turret', 'assets/LaserTurret.png');

        // Load the export Tiled JSON
        this.load.tilemapTiledJSON('map', 'assets/map.json');
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
        this.map = this.make.tilemap({ key: 'map' });
        this.createBackground();
        this.createTurret();
        this.loadBlockly();
    }

    createBackground() {
        const SCREEN_WIDTH = this.cameras.main.width;
        const SCREEN_HEIGHT = this.cameras.main.height;

        const groundLayer = this.map.getObjectLayer("Ground");

        if (!groundLayer) {
            console.error("No ground layer found");
            return;
        }

        const numTilesPer = Math.sqrt(groundLayer.objects.length);
        const totalWidth = this.TILE_SIZE * numTilesPer;
        const totalHeight = this.TILE_SIZE * numTilesPer;

        const startX = (SCREEN_WIDTH - totalWidth) / 2;
        const startY = (SCREEN_HEIGHT - totalHeight) / 2 - this.TILE_SIZE;

        this.map.getObjectLayer('Ground')!.objects.forEach((block) => {
            // Add new spikes to our sprite group
            const xCoord = startX + block.x!;
            const yCoord = startY + block.y!;
            const tile = this.add.image(xCoord, yCoord, 'tile').setOrigin(0, 0).setInteractive();
            tile.input!.dropZone = true;
        });

        this.input.on('dragenter', (pointer, gameObject, dropZone) => {
            dropZone.setTint(0x00ff00);
        });

        this.input.on('dragleave', (pointer, gameObject, dropZone) => {
            dropZone.clearTint();
        });

        this.input.on('drop', (pointer, gameObject, dropZone) => {
            gameObject.x = dropZone.x + this.TILE_SIZE / 2;
            gameObject.y = dropZone.y + this.TILE_SIZE / 2;

            dropZone.clearTint();
        });
    }

    createTurret() {
        var turret = this.add.sprite(100, 100, 'Turret');
        turret.setInteractive();
        const targetWidth = 200;
        const targetHeight = 200;
        const scaleFactor = Math.min(targetWidth / turret.width, targetHeight / turret.height);
        turret.setScale(scaleFactor);

        // Enable drag behavior for the sprite
        this.input.setDraggable(turret);

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