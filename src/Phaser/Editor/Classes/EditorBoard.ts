import * as Phaser from 'phaser'
import DropZoneTile from './DropZoneTile'
import config from "../../config";
import LevelEditor from '../LevelEditor';

export default class EditorBoard {
    private dropZoneTiles: DropZoneTile[] = [];
    private x: number;
    private y: number;
    private numRows: number;
    private numCols: number;
    private scene: Phaser.Scene;
    tilesize: number;

    constructor(scene: LevelEditor, x: number, y: number, rows: number, cols: number, tiles?: DropZoneTile[]) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.numRows = rows;
        this.numCols = cols;
        this.dropZoneTiles = tiles || [];

        console.log(`Creating board at: ${x}, ${y}`);

        if (!tiles)
            this.createDefaultTiles();

        // TODO: pintar tiles si ya existen
        // else
        //     paintExistingTiles()

        this.createResizeButtons();
    }

    private createDefaultTiles(): void {
        const scaledTileSize = config.TILE_SIZE * (<LevelEditor>this.scene).scaleFactor;

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
    }

    private getTopLeft(): Phaser.Math.Vector2 {
        const tileOffset = config.TILE_SIZE / 2 * (<LevelEditor>this.scene).scaleFactor

        return new Phaser.Math.Vector2(this.x - tileOffset, this.y - tileOffset);
    }

    private getTopRight(): Phaser.Math.Vector2 {
        const tl = this.getTopLeft();
        return new Phaser.Math.Vector2(tl.x + this.numCols * config.TILE_SIZE * (<LevelEditor>this.scene).scaleFactor, tl.y);
    }

    private getRightCenter(): Phaser.Math.Vector2 {
        const tl = this.getTopLeft();

        return new Phaser.Math.Vector2(tl.x + this.numCols * config.TILE_SIZE * (<LevelEditor>this.scene).scaleFactor, tl.y + this.numRows / 2 * config.TILE_SIZE * (<LevelEditor>this.scene).scaleFactor);
    }

    addCol(numRows: number) {
        console.log("adding col");

        const tileOffset = config.TILE_SIZE / 2 * (<LevelEditor>this.scene).scaleFactor;
        const scaledTileSize = config.TILE_SIZE * (<LevelEditor>this.scene).scaleFactor;
        const topRight = this.getTopRight();

        for (let i = 0; i < numRows; i++) {
            console.log(`Adding tile at: ${topRight.x}, ${topRight.y + i * scaledTileSize}`);

            const tile = new DropZoneTile(this.scene, topRight.x + tileOffset, topRight.y + tileOffset + i * scaledTileSize, scaledTileSize, scaledTileSize); //TODO gestionar tamaño y posicion
            this.dropZoneTiles.splice(i * this.numCols + this.numCols - 1, 0, tile);
        }

        this.numCols++;
    }

    addRow() {
        this.numRows++;
        for (let i = 0; i < this.numCols; i++) {
            const tile = new DropZoneTile(this.scene, 0, 0, 0, 0); //TODO gestionar tamaño y posicion
            this.dropZoneTiles.splice(this.numCols * this.numRows - 1, 0, tile);
        }
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

    scale() {
        //TODO coger tamaño pantalla en base al board y escalar Todo!
    }

    toJSON(): Record<any, any> {
        //TODO pasar nivel actual a JSON siguiendo diseño de Nico
        return null;
    }

    private getNumPlayers(): number {
        //TODO
        return 0;
    }

    private getNumObj(): number {
        //TODO
        return 0;
    }
}
