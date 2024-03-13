import { Direction } from "../types/Direction";
import config from "../../config"
import { GridPhysics } from "./GridPhysics";

export class Player {
    private facingDirections = [Direction.DOWN, Direction.LEFT, Direction.UP, Direction.RIGHT];
    private movementDirection: Direction = Direction.NONE;  // Always none except when moving
    private steps: number = 0;
    private playerDir : number = 0; //por defecto la ranita mira "abajo" down/left/up/right
    private isAlive = true;
    private collectedChest = false;

    constructor(
        private sprite: Phaser.GameObjects.Sprite,
        private gridPhysics: GridPhysics,
        private tilePos: Phaser.Math.Vector2,
        private scaleFactor: number
    ) {
        this.addEventListeners();
    }

    private addEventListeners() {
        document.addEventListener("move", e => {
            const data = (<CustomEvent>e).detail;
            this.steps = 1;
            this.movePlayer(Direction[data["direction"]]);
        });
        this.sprite.scene.events.on("rotateOrder", (direction: Direction) => {
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
            duration: config.MOVEMENT_ANIMDURATION,
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
            duration: config.MOVEMENT_ANIMDURATION / 2,
            ease: "Sine.inOut",
            yoyo: true,
            onComplete: this.stopAnimation.bind(this)
        })
    }

    movePlayer(direction: Direction): void {
        if (this.steps == 0 || !this.isAlive || this.collectedChest)
            return;

        if (this.gridPhysics.isBlockingDirection(this.getTilePos(), direction)) {
            this.startAnimation(direction);
            this.bounceAnimation(direction);
        } else {
            this.startMoving(direction);
            this.gridPhysics.collide(this);
        }
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
              this.stopAnimation.bind(this)
              this.sprite.destroy();
            }
          });
        //this.sprite.anims.play('dying', true);

      }

    getIsAlive(): Boolean {
        return this.isAlive;
    }

    hasCollectedChest(): Boolean {
        return this.collectedChest;
    }

    kill() {
        this.isAlive = false;
    }
    
    collectChest() {
        this.collectedChest = true;
    }
}