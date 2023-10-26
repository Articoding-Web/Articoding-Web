import { Direction } from "../types/Direction";
import config from "../config"

export class Player {
    constructor(
        private sprite: Phaser.GameObjects.Sprite,
        private tilePos: Phaser.Math.Vector2,
        mapCoordX : number,
        mapCoordY : number,
    ) {
        const offsetX = config.TILE_SIZE / 2 + mapCoordX;
        const offsetY = config.TILE_SIZE + mapCoordY;

        this.sprite.setOrigin(0.5, 1);
        this.sprite.setPosition(
            tilePos.x * config.TILE_SIZE + offsetX,
            tilePos.y * config.TILE_SIZE + offsetY
        );
    }

    getPosition(): Phaser.Math.Vector2 {
        return this.sprite.getBottomCenter();
    }

    setPosition(position: Phaser.Math.Vector2): void {
        this.sprite.setPosition(position.x, position.y);
    }

    stopAnimation(direction: Direction) {
        const animationManager = this.sprite.anims.animationManager;
        const standingFrame = animationManager.get(direction).frames[1].frame.name;
        this.sprite.anims.stop();
        this.sprite.setFrame(standingFrame);
    }

    startAnimation(direction: Direction) {
        this.sprite.anims.play(direction);
    }

    getTilePos(): Phaser.Math.Vector2 {
        return this.tilePos.clone();
    }

    setTilePos(tilePosition: Phaser.Math.Vector2): void {
        this.tilePos = tilePosition.clone();
    }
}