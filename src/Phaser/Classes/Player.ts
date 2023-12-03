import { Direction } from "../types/Direction";
import config from "../config"
import { GridPhysics } from "./GridPhysics";
import ChestObject from "./ChestObject";

export class Player {
    private facingDirections = [Direction.DOWN, Direction.LEFT, Direction.UP, Direction.RIGHT];
    private movementDirection: Direction = Direction.NONE;  // Always none except when moving
    private steps: number = 0;
    private playerDir : number = 0; //por defecto la ranita mira "abajo" down/left/up/right
    private collidingWith: ChestObject = undefined; // TODO: cambiar esto por obj. general / interfaz

    constructor(
        private sprite: Phaser.GameObjects.Sprite,
        private gridPhysics: GridPhysics,
        private tilePos: Phaser.Math.Vector2,
        private scaleFactor: number
    ) {
        this.addEventListeners();
    }

    private addEventListeners() {
        this.sprite.scene.events.on("moveOrder", (steps: number, direction: Direction) => {
            console.log("received move");

            this.steps = steps;
            this.movePlayer(direction);
        });
        this.sprite.scene.events.on("rotateOrder", (direction: Direction) => {
            console.log(`received rotate order: in ${direction}`);

            this.rotatePlayer(direction);
        });
    }

    private rotatePlayer(direction: Direction): void {
        if(direction === Direction.RIGHT){
            this.playerDir++;
            this.playerDir %= 4;
        }
        else{
            this.playerDir += 3;
            this.playerDir %= 4;
        }

        this.stopMoving();
    }

    private startMoving(direction: Direction): void {
        this.movementDirection = direction;
        this.startAnimation(direction);
        this.movePlayerSprite();
    }

    private updatePlayerTilePos() {
        const movementVector = this.gridPhysics.getMovementVector(this.movementDirection);
        this.setTilePos(this.getTilePos().add(movementVector));
    }

    private movePlayerSprite() {
        const pixelsToMove = config.TILE_SIZE * this.scaleFactor;
        const movementDistance = this.gridPhysics.getMovementDistance(this.movementDirection, pixelsToMove);
        const newPlayerPos = this.getPosition().add(movementDistance);
        this.updatePlayerTilePos();

        this.sprite.scene.tweens.add({
            targets: this.sprite,
            x: newPlayerPos.x,
            y: newPlayerPos.y,
            duration: 1000,
            ease: "Sine.inOut",
            onComplete: (--this.steps > 0) ? this.movePlayer.bind(this, this.movementDirection) : this.stopMoving.bind(this),
        })
    }

    private stopMoving(): void {
        this.stopAnimation();
        this.movementDirection = Direction.NONE;
    }

    getPosition(): Phaser.Math.Vector2 {
        return this.sprite.getBottomCenter();
    }

    setPosition(position: Phaser.Math.Vector2): void {
        this.sprite.setPosition(position.x, position.y);
    }

    stopAnimation() {
        this.sprite.anims.stop();

        // Set new idle frame
        const animationManager = this.sprite.anims.animationManager;
        const standingFrame = animationManager.get(this.facingDirections[this.playerDir]).frames[0].frame.name;
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

    bounceAnimation(direction){
        const pixelsToMove = config.TILE_SIZE / 2 * this.scaleFactor;
        const movementDistance = this.gridPhysics.getMovementDistance(direction, pixelsToMove);
        const newPlayerPos = this.getPosition().add(movementDistance);

        this.sprite.scene.tweens.add({
            targets: this.sprite,
            x: newPlayerPos.x,
            y: newPlayerPos.y,
            duration: 1000,
            ease: "Sine.inOut",
            yoyo: true,
            onComplete: this.stopAnimation.bind(this)
        })
    }

    movePlayer(direction: Direction): void {
        if (this.steps == 0)
            return;

        if (this.gridPhysics.isBlockingDirection(this.getTilePos(), direction)) {
            this.startAnimation(direction);
            this.bounceAnimation(direction);
        } else {
            this.setCollidingObject(undefined);
            this.startMoving(direction);
            this.gridPhysics.collide(this);
        }
        
    }

    setCollidingObject(obj: ChestObject) { 
        this.collidingWith = obj;
    }

    getCollidingObject() : ChestObject {
        return this.collidingWith;
    }

    // update(delta: number) {
    //     if (this.isMoving()) {
    //         this.updatePlayerPosition(delta);
    //     }
    //     this.lastMovementIntent = Direction.NONE;
    // }
}