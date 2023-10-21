import TileObject from "./TileObject";
import ArticodingObject from "./ArticodingObject";

export default class Board {
  tiles: TileObject[];

  constructor() {}

  setTiles(tiles: TileObject[]) {
    this.tiles = tiles;
  }

  addObject(object: ArticodingObject, cell: TileObject) {
    this.tiles.map((tile) => {
      if (tile === cell) tile.addObject(object);
    });
  }

  remove(obj: ArticodingObject) {
    this.tiles.map((tile) => {
      if (tile.object === obj) tile.deleteObject();
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
        //object.dropZone.occupied = false;
        tile.addObject(object);
      }
    });
  }
}
