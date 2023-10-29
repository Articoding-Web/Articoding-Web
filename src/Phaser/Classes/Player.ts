import { Direction } from "../types/Direction";
import config from "../config"
import { GridPhysics } from "./GridPhysics";

export class Player {
    private movementDirection: Direction = Direction.NONE;
    private lastMovementIntent = Direction.NONE;
    private tileSizePixelsWalked: number = 0;

    constructor(
        private sprite: Phaser.GameObjects.Sprite,
        private gridPhysics : GridPhysics,
        private tilePos: Phaser.Math.Vector2,
    ) {
        this.addEventListener();
    }

    private addEventListener(){
        this.sprite.scene.events.on("runCode", (steps: number, direction : Direction) => {
            console.log("received move");
            if(steps == 0)
                return;
            
            this.movePlayer(direction);
        });
    }

    private isMoving(): boolean {
        return this.movementDirection != Direction.NONE;
    }

    private startMoving(direction: Direction): void {
        this.startAnimation(direction);
        this.movementDirection = direction;
        this.updatePlayerTilePos();
    }

    private updatePlayerPosition(delta: number) {
        const pixelsToWalkThisUpdate = this.gridPhysics.getPixelsToWalkThisUpdate(delta);

        if (!this.gridPhysics.willCrossTileBorderThisUpdate(this.tileSizePixelsWalked ,pixelsToWalkThisUpdate)) {
            this.movePlayerSprite(pixelsToWalkThisUpdate);
        } else if (this.shouldContinueMoving()) {
            this.movePlayerSprite(pixelsToWalkThisUpdate);
            this.updatePlayerTilePos();
        } else {
            this.movePlayerSprite(config.TILE_SIZE - this.tileSizePixelsWalked);
            this.stopMoving();
        }
    }

    private updatePlayerTilePos() {
        const movementVector = this.gridPhysics.getMovementVector(this.movementDirection);
        this.setTilePos(this.getTilePos().add(movementVector));
    }

    private movePlayerSprite(pixelsToMove: number) {
        const movementDistance = this.gridPhysics.getMovementDistance(this.movementDirection, pixelsToMove);
        const newPlayerPos = this.getPosition().add(movementDistance);
        this.setPosition(newPlayerPos);

        this.tileSizePixelsWalked += pixelsToMove;
        this.tileSizePixelsWalked %= config.TILE_SIZE;
    }

    private stopMoving(): void {
        this.stopAnimation(this.movementDirection);
        this.movementDirection = Direction.NONE;
    }

    private shouldContinueMoving(): boolean {
        return (
            this.movementDirection == this.lastMovementIntent &&
            !this.gridPhysics.isBlockingDirection(this.getTilePos() ,this.lastMovementIntent)
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
        this.movementDirection = direction;
    }

    getTilePos(): Phaser.Math.Vector2 {
        return this.tilePos.clone();
    }

    setTilePos(tilePosition: Phaser.Math.Vector2): void {
        this.tilePos = tilePosition.clone();
    }

    movePlayer(direction: Direction): void {
        this.lastMovementIntent = direction;
        if (this.isMoving()){
            console.log("already moving");
            return;
        }
        if (this.gridPhysics.isBlockingDirection(this.getTilePos(), direction)) {
            console.log("blocked");
            this.stopAnimation(direction);
        } else {
            console.log("start moving");
            this.startMoving(direction);
        }
    }

    update(delta: number) {
        if (this.isMoving()) {
            this.updatePlayerPosition(delta);
        }
        this.lastMovementIntent = Direction.NONE;
    }
}