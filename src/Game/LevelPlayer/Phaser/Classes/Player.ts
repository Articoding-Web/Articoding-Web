import { Direction } from "../types/Direction";
import { GridPhysics } from "./GridPhysics";
import config from "../../../config";

export class Player {
    private facingDirections = [Direction.DOWN, Direction.LEFT, Direction.UP, Direction.RIGHT];
    private steps: number = 0;
    private playerDir: number = 0; //por defecto la ranita mira "abajo" down/left/up/right
    private isAlive = true;
    private reachedExit = false;
    private collectedChests:number = 0;

    constructor(private sprite: Phaser.GameObjects.Sprite, private gridPhysics: GridPhysics, private tilePos: Phaser.Math.Vector2, private scaleFactor: number) {
        document.addEventListener("move", this.handleMove);
    }

    private handleMove = (e: Event) => {
        const data = (e as CustomEvent).detail;
        this.steps = 1;
        this.movePlayer(Direction[data["direction"]]);
    }

    private movePlayer(direction: Direction): void {
        if (this.steps == 0 || !this.isAlive || this.reachedExit)
            return;

        if (this.gridPhysics.isBlockingDirection(this.getTilePos(), direction)) {
            this.startRunningAnimation(direction);
            this.bounceTween(direction);
        } else {
            this.startRunningAnimation(direction);
            this.moveTween(direction);
            this.gridPhysics.collide(this);
        }
    }

    private moveTween(direction: Direction) {
        const pixelsToMove = config.TILE_SIZE * this.scaleFactor;
        const movementDistance = this.gridPhysics.getMovementDistance(direction, pixelsToMove);
        const newPlayerPos = this.getPosition().add(movementDistance);
        this.updatePlayerTilePos(direction);

        this.sprite.scene.tweens.add({
            targets: this.sprite,
            x: newPlayerPos.x,
            y: newPlayerPos.y,
            duration: config.MOVEMENT_ANIMDURATION,
            ease: "Sine.inOut",
            onComplete: this.stopMoving.bind(this)
        })
    }

    private bounceTween(direction) {
        const pixelsToMove = config.TILE_SIZE / 2 * this.scaleFactor;
        const movementDistance = this.gridPhysics.getMovementDistance(direction, pixelsToMove);
        const newPlayerPos = this.getPosition().add(movementDistance);

        this.sprite.scene.tweens.add({
            targets: this.sprite,
            x: newPlayerPos.x,
            y: newPlayerPos.y,
            duration: config.MOVEMENT_ANIMDURATION / 2,
            ease: "Sine.inOut",
            yoyo: true,
            onComplete: this.stopMoving.bind(this)
        })
    }

    private startRunningAnimation(direction: Direction) {
        this.sprite.anims.play(direction);
    }

    private stopAnimation() {
        this.sprite.anims.stop();

        // Set new idle frame
        const animationManager = this.sprite.anims.animationManager;
        const standingFrame = animationManager.get(this.facingDirections[this.playerDir]).frames[0].frame.name;
        this.sprite.setFrame(standingFrame);
    }

    private stopMoving(): void {
        this.stopAnimation();
    }

    private updatePlayerTilePos(direction: Direction) {
        const movementVector = this.gridPhysics.getMovementVector(direction);
        this.setTilePos(this.getTilePos().add(movementVector));
    }

    getPosition(): Phaser.Math.Vector2 {
        return this.sprite.getBottomCenter();
    }

    setPosition(position: Phaser.Math.Vector2): void {
        this.sprite.setPosition(position.x, position.y);
    }

    getTilePos(): Phaser.Math.Vector2 {
        return this.tilePos.clone();
    }

    setTilePos(tilePosition: Phaser.Math.Vector2): void {
        this.tilePos = tilePosition.clone();
    }

    //TODO test @sanord8
    die() {
        this.sprite.scene.tweens.add({
            targets: this.sprite,
            alpha: 0,
            scale: 0,
            angle: 360,
            duration: 2500,
            onComplete: () => {
                // nothing so far
            }
        });

    }

    getIsAlive(): Boolean {
        return this.isAlive;
    }

    getCollectedChest(): number {
        return this.collectedChests;
    }

    kill() {
        this.isAlive = false;
    }

    collectChest() {
        this.collectedChests++;
    }

    exit() {
        this.reachedExit = true;
    }

    hasReachedExit() {
        return this.reachedExit;
    }

    destroy() {
        document.removeEventListener("move", this.handleMove);
        this.sprite.destroy();
    }
}