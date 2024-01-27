import TileObject from "./TileObject";
import ArticodingObject from "../../Editor/Classes/ArticodingObject";

export default class Board {
  tiles: TileObject[];

  constructor() {}

  setTiles(tiles: TileObject[]) {
    this.tiles = tiles;
  }

  findTile(obj: ArticodingObject) : TileObject {
    let tileToFind  = undefined;
    this.tiles.forEach((tile) => {
        if(tile.object === obj ){
           tileToFind = tile;
           return;
        }
    });
    return tileToFind;
  }

  addObject(object: ArticodingObject, cell: TileObject) {
    this.tiles.map((tile) => {
      if (tile === cell) tile.addObject(object);
    });
  }

  remove(obj: ArticodingObject) {
    this.tiles.map((tile) => {
      if (tile.object === obj){ 
        tile.deleteObject();
        return;
      }
    });
  }

  removeAll() {
    this.tiles.forEach((tile) => {
      tile.deleteObject();
    });
  }

  move(object: ArticodingObject, cell: TileObject) {
    this.tiles.map((tile) => {
      if (tile === cell) {
        tile.addObject(object);
        return;
      }
    });
  }
}
