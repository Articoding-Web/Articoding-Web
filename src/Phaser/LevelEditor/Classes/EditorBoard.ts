import * as Phaser from 'phaser';
import DropZoneTile from './DropZoneTile';
import LevelEditor from '../LevelEditor';
import config from '../../../config';

export default class EditorBoard {
    private dropZoneTiles: DropZoneTile[] = [];
    private scaleFactor: number;
    private x: number;
    private y: number;
    private numRows: number;
    private numCols: number;
    private scene: Phaser.Scene;

    private rmColBtn: Phaser.GameObjects.Sprite;
    private addColBtn: Phaser.GameObjects.Sprite;
    private rmRowBtn: Phaser.GameObjects.Sprite;
    private addRowBtn: Phaser.GameObjects.Sprite;

    constructor(scene: LevelEditor, rows: number, cols: number, tiles?: DropZoneTile[]) {
        this.scene = scene;
        this.numRows = rows;
        this.numCols = cols;

        this.calculateScale();

        this.dropZoneTiles = tiles || [];

        if (!tiles)
            this.createDefaultTiles();

        // TODO: pintar tiles si ya existen
        // else
        //     paintExistingTiles()

        this.createResizeButtons();
    }

    private calculateScale(){
        const layerWidth = this.numCols * config.TILE_SIZE;
        const layerHeight = this.numRows * config.TILE_SIZE;

        this.scaleFactor = Math.floor((this.scene.cameras.main.height) / layerHeight / 2);
        this.x = (this.scene.cameras.main.width - layerWidth * this.scaleFactor) / 2 - layerWidth;
        this.y = (this.scene.cameras.main.height - layerHeight * this.scaleFactor) / 2;
    }

    private createDefaultTiles(): void {
        const scaledTileSize = config.TILE_SIZE * this.scaleFactor;

        for (let y = 0; y < this.numRows; y++) {
            for (let x = 0; x < this.numCols; x++) {
                const tile = new DropZoneTile(this.scene, this.x + x * scaledTileSize, this.y + y * scaledTileSize, scaledTileSize, scaledTileSize);
                this.dropZoneTiles.push(tile);
            }
        }
    }

    private createResizeButtons(): void {
        const tlCoords = this.getTopLeft();

        // Remove column
        this.rmColBtn = this.scene.add.sprite(0, 0, "red").setInteractive();
        this.rmColBtn.on("pointerdown", () => this.rmColBtn.setTexture("red-pressed"));
        this.rmColBtn.on("pointerup", this.removeCol, this);

        const rmColContainer = this.scene.add.container(tlCoords.x + 50, tlCoords.y - 50);
        rmColContainer.add(this.rmColBtn);
        rmColContainer.add(this.scene.add.sprite(0, 0, "minus"));

        // Add column
        this.addColBtn = this.scene.add.sprite(0, 0, "green").setInteractive();
        this.addColBtn.on("pointerdown", () => this.addColBtn.setTexture("green-pressed"));
        this.addColBtn.on("pointerup", this.addCol, this);

        const addColContainer = this.scene.add.container(tlCoords.x + 150, tlCoords.y - 50);
        addColContainer.add(this.addColBtn);
        addColContainer.add(this.scene.add.sprite(0, 0, "plus"));

        // Remove row
        this.rmRowBtn = this.scene.add.sprite(0, 0, "red").setInteractive();
        this.rmRowBtn.on("pointerdown", () => this.rmRowBtn.setTexture("red-pressed"));
        this.rmRowBtn.on("pointerup", this.removeRow, this);

        const rmRowContainer = this.scene.add.container(tlCoords.x - 50, tlCoords.y + 50);
        rmRowContainer.add(this.rmRowBtn);
        rmRowContainer.add(this.scene.add.sprite(0, 0, "minus"));

        // Add column
        this.addRowBtn = this.scene.add.sprite(0, 0, "green").setInteractive();
        this.addRowBtn.on("pointerdown", () => this.addRowBtn.setTexture("green-pressed"));
        this.addRowBtn.on("pointerup", this.addRow, this);

        const addRowContainer = this.scene.add.container(tlCoords.x - 50, tlCoords.y + 150);
        addRowContainer.add(this.addRowBtn);
        addRowContainer.add(this.scene.add.sprite(0, 0, "plus"));
    }

    private getTopLeft(): Phaser.Math.Vector2 {
        const tileOffset = config.TILE_SIZE / 2 * this.scaleFactor

        return new Phaser.Math.Vector2(this.x - tileOffset, this.y - tileOffset);
    }

    private getTopRight(): Phaser.Math.Vector2 {
        const tl = this.getTopLeft();
        return new Phaser.Math.Vector2(tl.x + this.numCols * config.TILE_SIZE * this.scaleFactor, tl.y);
    }

    private getBottomLeft(): Phaser.Math.Vector2 {
        const tl = this.getTopLeft();

        return new Phaser.Math.Vector2(tl.x, tl.y + this.numRows * config.TILE_SIZE * this.scaleFactor);
    }

    private addCol() {
        this.addColBtn.setTexture("green");
        
        if(this.numCols >= config.EDITOR_MAX_COLS)
            return;

        const tileOffset = config.TILE_SIZE / 2 * this.scaleFactor;
        const scaledTileSize = config.TILE_SIZE * this.scaleFactor;
        const topRight = this.getTopRight();

        for (let i = 0; i < this.numRows; i++) {
            const tile = new DropZoneTile(this.scene, topRight.x + tileOffset, topRight.y + tileOffset + i * scaledTileSize, scaledTileSize, scaledTileSize);
            this.dropZoneTiles.splice(i * this.numCols + this.numCols - 1, 0, tile);
        }

        this.numCols++;
    }

    private removeCol() {
        this.rmColBtn.setTexture("red");

        if(this.numCols <= config.EDITOR_MIN_COLS)
            return;

        console.log("removing col");
    }

    private addRow() {
        this.addRowBtn.setTexture("green");
        
        if(this.numRows >= config.EDITOR_MAX_ROWS)
            return;

        const tileOffset = config.TILE_SIZE / 2 * this.scaleFactor;
        const scaledTileSize = config.TILE_SIZE * this.scaleFactor;
        const bottomLeft = this.getBottomLeft();

        for (let i = 0; i < this.numCols; i++) {
            const tile = new DropZoneTile(this.scene, bottomLeft.x + tileOffset + i * scaledTileSize, bottomLeft.y + tileOffset, scaledTileSize, scaledTileSize);
            this.dropZoneTiles.push(tile);
        }

        this.numRows++;
    }

    private removeRow() {
        this.rmRowBtn.setTexture("red");

        if(this.numRows <= config.EDITOR_MIN_ROWS)
            return;

        console.log("removing row");
        for(let x = this.numRows * this.numCols; x < this.dropZoneTiles.length; x++) {
            console.log(x);
        }
    }

    toJSON(): Record<any, any> {
        // let json = 
        return null;
    }
}