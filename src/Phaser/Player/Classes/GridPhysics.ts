import * as Phaser from "phaser";

import { Direction } from "../../types/Direction";
import config from "../../config"
import ChestObject from "./ChestObject";
import { Player } from "./Player";

const Vector2 = Phaser.Math.Vector2;
type Vector2 = Phaser.Math.Vector2;

export class GridPhysics {
    private movementDirectionVectors: {[key in Direction]?: Vector2;} = {
            [Direction.UP]: Vector2.UP,
            [Direction.DOWN]: Vector2.DOWN,
            [Direction.LEFT]: Vector2.LEFT,
            [Direction.RIGHT]: Vector2.RIGHT,
        };

    private speedPixelsPerSecond: number;

    constructor(
        private tileMap: Phaser.Tilemaps.Tilemap,
        private scaleFactor: number,
        private objects: ChestObject[]    // TODO: cambiar ChestObject por tipo generico
    ) {
        this.speedPixelsPerSecond = config.TILE_SIZE * this.scaleFactor;
    }

    getMovementVector(movementDirection: Direction) : Phaser.Math.Vector2 {
        return this.movementDirectionVectors[movementDirection]!.clone();
    }

    getMovementDistance(movementDirection : Direction, pixelsToMove : number) : Phaser.Math.Vector2 {
        const directionVec = this.getMovementVector(movementDirection);
        return directionVec.multiply(new Vector2(pixelsToMove));
    }

    getPixelsToWalkThisUpdate(delta: number): number {
        const deltaInSeconds = delta / 1000;
        return this.speedPixelsPerSecond * deltaInSeconds;
    }

    isBlockingDirection(sourceTilePos: Phaser.Math.Vector2, direction: Direction): boolean {
        return this.hasBlockingTile(this.tilePosInDirection(sourceTilePos, direction));
    }

    tilePosInDirection(sourceTilePos: Phaser.Math.Vector2, direction: Direction): Vector2 {
        return sourceTilePos.add(this.movementDirectionVectors[direction]);
    }

    hasBlockingTile(pos: Vector2): boolean {
        if (this.hasNoTile(pos)){
            console.log("No tile");
            return true;
        }
        return this.tileMap.layers.some((layer) => {
            const tile = this.tileMap.getTileAt(pos.x, pos.y, false, layer.name);
            return tile && tile.properties && tile.properties.collides;
        });
    }

    private hasNoTile(pos: Vector2): boolean {
        return !this.tileMap.layers.some((layer) =>
            this.tileMap.hasTileAt(pos.x, pos.y, layer.name)
        );
    }

    collide(player: Player): void {
        // get obj in position
        const pos = player.getTilePos();

        this.objects.forEach((obj) => {
            // If obj in same position, collide
            if(obj.getPosition().equals(pos)){
                obj.collide(player);
            }
        });
    }
}