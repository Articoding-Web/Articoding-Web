import * as Phaser from 'phaser';

export default class ArticodingObject extends Phaser.GameObjects.Sprite {
    allowMultiple: Boolean;    // allow object to be duplicated or not
    frameString: string | number | undefined;
    onDropZone: Boolean = false;
    origX : number;
    origY: number;
    scene: Phaser.Scene;
    objects: Phaser.GameObjects.Sprite[] = [];
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, allowMultiple: Boolean,
        objects: Phaser.GameObjects.Sprite[], frame?: string | number | undefined) {
        super(scene, x, y, texture, frame);
        this.scene = scene;
        this.frameString = frame;
        this.allowMultiple = allowMultiple;
        this.origX = x;
        this.origY = y;
        this.objects = objects;
        this.objects.push(this);
        
        const scaleFactor = Math.min(100 / this.width, 100 / this.height); //TODO change texture
        this.setScale(scaleFactor);
        
        this.setInteractive();
        this.scene.input.setDraggable(this);

        this.on("drag", (pointer, dragX, dragY) => this.onDrag(dragX, dragY));
        this.on("dragstart", () => this.onDragStart());
        this.on("dragenter", (pointer, dropZone) => this.onDragEnter(pointer, dropZone));
        this.on("dragleave", (pointer, dropZone) => this.onDragLeave(pointer, dropZone));
        this.on("dragend", (pointer) => this.onDragEnd(this.x, this.y));
        this.on("drop", (pointer, dropZone) => this.onDrop(dropZone.x, dropZone.y));

        this.scene.add.existing(this);
    }

    onDrag(dragX, dragY) {
        this.x = dragX;
        this.y = dragY;
    }

    onDragStart() {
        this.scene.children.bringToTop(this);
    }

    onDragEnter(pointer, dropZone) {
        dropZone.setTint(0x00ff00);
        this.onDropZone = true;
    }

    onDragLeave(pointer, dropZone) {
        dropZone.clearTint();
        this.onDropZone = false;
    }

    onDragEnd(x: number, y: number) {
        if (!this.onDropZone){
            this.destroy();
            this.objects.filter((object) =>{
                if (object.x !== x && object.y !== y) return object;
            })
        }
    }

    onDrop(x : number, y : number) {
        if (this.allowMultiple) {
            this.x = this.origX;
            this.y = this.origY;
            this.objects.map(function(object) {
                if (object.x !== this.x && object.y !== this.y) {
                    new ArticodingObject(this.scene, x, y, this.texture, false, this.objects, this.frameString);
                    return;
                }
            })
            
        } else {
            this.x = x;
            this.y = y;
        }
    }
}