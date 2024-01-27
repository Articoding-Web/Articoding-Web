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

        this.scene.add.sprite(rightCenterCoords.x, rightCenterCoords.y, "a");
    }

    private getTopRight(): Phaser.Math.Vector2 {
        const xCoord = this.x + this.numCols * config.TILE_SIZE * (<LevelEditor>this.scene).scaleFactor;
        return new Phaser.Math.Vector2(xCoord, this.y);
    }

    // TODO: Revisar
    private getRightCenter(): Phaser.Math.Vector2 {
        const xCoord = this.x + this.numCols * config.TILE_SIZE * (<LevelEditor>this.scene).scaleFactor;
        const yCoord = this.y + this.numRows / 2 * config.TILE_SIZE * (<LevelEditor>this.scene).scaleFactor;

        return new Phaser.Math.Vector2(xCoord, yCoord);
    }

    addCol() {
        this.numCols++;
        for (let i = 0; i < this.numRows; i++) {
            const tile = new DropZoneTile(this.scene, 0, 0, 0, 0); //TODO gestionar tamaño y posicion
            this.dropZoneTiles.splice(i * this.numCols + this.numCols - 1, 0, tile);
        }
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
