import * as Phaser from "phaser";
import TileObject from "./TileObject";

export default class ArticodingObject extends Phaser.GameObjects.Sprite {
    allowMultiple: Boolean; // allow object to be duplicated or not
    allowDestruction: Boolean = false;
    frameString: string | number | undefined;
    isOnDropZone: Boolean = false;
    origX: number;
    origY: number;
    dropZone: TileObject | undefined;

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, allowMultiple: Boolean, frame?: string | number | undefined, allowDestruction?: Boolean) {
        super(scene, x, y, texture, frame);
        this.scene = scene;
        this.frameString = frame;
        this.allowMultiple = allowMultiple;
        this.origX = x;
        this.origY = y;
        this.allowDestruction = allowDestruction;

        const scaleFactor = Math.min(100 / this.width, 100 / this.height); //TODO change texture
        this.setScale(scaleFactor);

        this.setInteractive();
        this.scene.input.setDraggable(this);

        this.on("drag", (pointer, dragX, dragY) => this.onDrag(dragX, dragY));
        this.on("dragstart", () => this.onDragStart());
        this.on("dragenter", (pointer, dropZone) => this.onDragEnter());
        this.on("dragleave", (pointer, dropZone) => this.onDragLeave());
        this.on("dragend", (pointer) => this.onDragEnd(this.x, this.y));
        this.on("drop", (pointer, dropZone) => this.onDrop(dropZone));

        this.scene.add.existing(this);
    }

    onDrag(dragX : number, dragY : number) {
        this.x = dragX;
        this.y = dragY;
    }

    onDragStart() {
        this.scene.children.bringToTop(this);
    }

    onDragEnter() {
        this.isOnDropZone = true;
    }

    onDragLeave() {
        this.isOnDropZone = false;
    }

    onDragEnd(x: number, y: number) {
        if (!this.isOnDropZone) {
            this.resetDropZone();

            // Reset/Destroy object
            if(this.allowDestruction){
                this.destroy();
            } else {
                this.x = this.origX;
                this.y = this.origY;
            }
        }
    }

    onDrop(dropZone : TileObject) {
        if (this.isOnDropZone && !dropZone.occupied) {
            this.resetDropZone();

            if (this.allowMultiple) {
                // Duplicate object as deletable
                let newObj = new ArticodingObject(
                    this.scene,
                    dropZone.x,
                    dropZone.y,
                    this.texture,
                    false,
                    this.frameString,
                    true
                );
                newObj.dropZone = dropZone;

                // Reset position
                this.x = this.origX;
                this.y = this.origY;
                this.isOnDropZone = false;
            } else {
                // Set position
                this.x = dropZone.x;
                this.y = dropZone.y;
                this.dropZone = dropZone;
            }

            // Zone occupied
            dropZone.occupied = true;
        } else {
            this.x = this.origX;
            this.y = this.origY;
        }
    }

    resetDropZone(){
        console.log(this.dropZone);
        if(this.dropZone !== undefined){
            this.dropZone.occupied = false;
            this.dropZone = undefined;
        }
    }
}
