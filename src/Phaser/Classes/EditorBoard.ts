import * as Phaser from 'phaser'
import DropZoneTile from './DropZoneTile'


export default class EditorBoard {
    
    private dropZoneTiles: DropZoneTile[] = [];
    private numRows : number;
    private numCols : number;
    private scene: Phaser.Scene;
    private levelJSON: Record<any,any>;
    static readonly TILE_SIZE = 100;
    tilesize : number;

    constructor(scene: Phaser.Scene,rows: number, cols: number, tiles?: DropZoneTile[], tileSize?: number) {
        this.scene = scene;
        this.numRows = rows;
        this.numCols = cols;
        this.dropZoneTiles = tiles || this.createDefaultTiles();
        this.tilesize = tileSize || EditorBoard.TILE_SIZE;

    }

    private createDefaultTiles(): DropZoneTile[]{
        const tiles: DropZoneTile[] = [];
        for (let i = 0; i < (this.numCols*this.numRows); i++) {
            const tile = new DropZoneTile(this.scene, 0, 0, 0, 0); //TODO gestionar tamaño y posicion
            tiles.push(tile);
        }
        return tiles;
    }

    addCol(){
        this.numCols++;
        for (let i = 0; i < this.numRows; i++) {
            const tile = new DropZoneTile(this.scene, 0, 0, 0, 0); //TODO gestionar tamaño y posicion
            this.dropZoneTiles.splice(i * this.numCols + this.numCols - 1, 0, tile);
        }
    }

    addRow(){
        this.numRows++;
        for (let i = 0; i < this.numCols; i++) {
            const tile = new DropZoneTile(this.scene, 0, 0, 0, 0); //TODO gestionar tamaño y posicion
            this.dropZoneTiles.splice(this.numCols * this.numRows - 1, 0, tile);
        }
    }

    removeCol(){
        this.numCols--;
        for (let i = 0; i < this.numRows; i++) {
            this.dropZoneTiles.splice(i * this.numCols + this.numCols, 1);
        }
    }

    removeRow(){
        this.numRows--;
        for (let i = 0; i < this.numCols; i++) {
            this.dropZoneTiles.splice(this.numCols * this.numRows, 1);
        }
    }

    scale(){
        //TODO coger tamaño pantalla en base al board y escalar Todo!
    }

    toJSON(): Record<any,any> {
        //TODO pasar nivel actual a JSON siguiendo diseño de Nico
        return null;
    }

    private getNumPlayers(): number{
        //TODO
        return 0;
    }

    private getNumObj(): number{
        //TODO
        return 0;
    }
}
