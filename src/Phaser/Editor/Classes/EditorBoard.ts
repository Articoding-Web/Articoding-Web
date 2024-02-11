import * as Phaser from 'phaser'
import DropZoneTile from './DropZoneTile'
import config from "../../config";
import LevelEditor from '../LevelEditor';

export default class EditorBoard {
    private dropZoneTiles: DropZoneTile[] = [];
    private scaleFactor: number;
    private x: number;
    private y: number;
    private numRows: number;
    private numCols: number;
    private scene: Phaser.Scene;

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
        this.x = (this.scene.cameras.main.width - layerWidth * this.scaleFactor) / 2;
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
        const rightCenterCoords = this.getRightCenter();
        const addColBtn = this.scene.add.sprite(rightCenterCoords.x + 50, rightCenterCoords.y - 50, "+");
        const rmColBtn = this.scene.add.sprite(rightCenterCoords.x + 50, rightCenterCoords.y + 50, "-");

        addColBtn.setInteractive().on("pointerdown", () => this.addCol(this.numRows));

        const bottomCenterCoords = this.getBottomCenter();
        const addRowBtn = this.scene.add.sprite(bottomCenterCoords.x + 50, bottomCenterCoords.y + 50, "+");
        const rmRowBtn = this.scene.add.sprite(bottomCenterCoords.x - 50, bottomCenterCoords.y + 50, "-");

        addRowBtn.setInteractive().on("pointerdown", () => this.addRow(this.numCols));
    }

    private getTopLeft(): Phaser.Math.Vector2 {
        const tileOffset = config.TILE_SIZE / 2 * this.scaleFactor

        return new Phaser.Math.Vector2(this.x - tileOffset, this.y - tileOffset);
    }

    private getTopRight(): Phaser.Math.Vector2 {
        const tl = this.getTopLeft();
        return new Phaser.Math.Vector2(tl.x + this.numCols * config.TILE_SIZE * this.scaleFactor, tl.y);
    }

    private getRightCenter(): Phaser.Math.Vector2 {
        const tl = this.getTopLeft();

        return new Phaser.Math.Vector2(tl.x + this.numCols * config.TILE_SIZE * this.scaleFactor, tl.y + this.numRows / 2 * config.TILE_SIZE * this.scaleFactor);
    }

    private getBottomLeft(): Phaser.Math.Vector2 {
        const tl = this.getTopLeft();

        return new Phaser.Math.Vector2(tl.x, tl.y + this.numRows * config.TILE_SIZE * this.scaleFactor);
    }

    private getBottomCenter(): Phaser.Math.Vector2 {
        const tl = this.getTopLeft();

        return new Phaser.Math.Vector2(tl.x + this.numCols / 2 * config.TILE_SIZE * this.scaleFactor, tl.y + this.numRows * config.TILE_SIZE * this.scaleFactor);
    }

    private addCol(numRows: number) {
        console.log("adding col");

        const tileOffset = config.TILE_SIZE / 2 * this.scaleFactor;
        const scaledTileSize = config.TILE_SIZE * this.scaleFactor;
        const topRight = this.getTopRight();

        for (let i = 0; i < numRows; i++) {
            const tile = new DropZoneTile(this.scene, topRight.x + tileOffset, topRight.y + tileOffset + i * scaledTileSize, scaledTileSize, scaledTileSize);
            this.dropZoneTiles.splice(i * this.numCols + this.numCols - 1, 0, tile);
        }

        this.numCols++;
    }

    private addRow(numCols: number) {
        console.log("adding row");

        const tileOffset = config.TILE_SIZE / 2 * this.scaleFactor;
        const scaledTileSize = config.TILE_SIZE * this.scaleFactor;
        const bottomLeft = this.getBottomLeft();

        for (let i = 0; i < numCols; i++) {
            const tile = new DropZoneTile(this.scene, bottomLeft.x + tileOffset + i * scaledTileSize, bottomLeft.y + tileOffset, scaledTileSize, scaledTileSize);
            this.dropZoneTiles.push(tile);
        }

        this.numRows++;
    }

    removeCol() {
        this.numCols--;
        for (let i = 0; i < this.numRows; i++) {
            this.dropZoneTiles.splice(i * this.numCols + this.numCols, 1);
        }
    }

    removeRow() {
        this.numRows--;
        for (let i = 0; i < this.numCols; i++) {
            this.dropZoneTiles.splice(this.numCols * this.numRows, 1);
        }
    }

    private autoScale() {
        
    }
    
    getX(): number {
        return this.x;
    }
    getY(): number {
        return this.y;
    }

    toJSON(): Record<any, any> {
        //TODO pasar nivel actual a JSON siguiendo diseño de Nico
        return null;
    }

    getScaleFactor(): number {
        return this.scaleFactor;
    }


    getDropZoneAt(x: number, y: number): DropZoneTile {
        for (const tile of this.dropZoneTiles) {
            if (tile.contains(x, y)) {
                return tile;
            }
        }
        return null;
    }

}
