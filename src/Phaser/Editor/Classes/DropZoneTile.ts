import * as Phaser from 'phaser'
import ArticodingObject from './ArticodingObject';
import LevelEditor from '../LevelEditor';

export default class DropZoneTile extends Phaser.GameObjects.Zone {
    //owned sprite:
    private bgSprite: Phaser.GameObjects.Sprite;
    //owned object:
    private objectSprite: ArticodingObject;

    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number) {
        super(scene, x, y, width, height);

        this.setRectangleDropZone(width, height);

        // temporalmente para ver zona
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(2, 0xffff00);
        graphics.strokeRect(this.x - this.input.hitArea.width / 2, this.y - this.input.hitArea.height / 2, this.input.hitArea.width, this.input.hitArea.height);
        ////////////////////////////////////////////////////////////////////////////////

        this.scene.add.existing(this);
    }

    resize(x: number, y: number, width: number, height: number) {
        this.setPosition(x, y);
        this.setSize(width, height);
        //setRectangleDropZone tal vez de error
        this.setRectangleDropZone(width, height);
    }

    getBgSprite(): Phaser.GameObjects.Sprite {
        return this.bgSprite;
    }

    addSprite(sprite: ArticodingObject) {
        this.objectSprite = sprite;
    }
    
    contains(x: number, y: number): boolean {
        const left = this.x;
        const right = this.x + this.width;
        const top = this.y;
        const bottom = this.y + this.height;

        return x >= left && x <= right && y >= top && y <= bottom;
    }

    getObjectSprite(): Phaser.GameObjects.Sprite {
        return this.objectSprite;
    }

    setObjectSprite(sprite: ArticodingObject) {
        if (this.objectSprite) {
            // Replace current object sprite
            console.log("Destroyed old sprite");
            this.objectSprite.destroy();
        }
        
        if(this.bgSprite !== undefined){
            // Create duplicate sprite only if has background
            this.objectSprite = sprite;
        } else {
            // Destroy sprite
            sprite.destroy();
        }
    }

    setBgSprite(sprite: Phaser.GameObjects.Sprite) {
        this.bgSprite = sprite;
    }
}