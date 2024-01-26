import * as Phaser from 'phaser'

export default class DropZoneTile extends Phaser.GameObjects.Zone {
    //owned sprite:
   private bgSprite: Phaser.GameObjects.Sprite;
    //owned object:
   private objectSprite: Phaser.GameObjects.Sprite;

   
    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number){
        super(scene, x, y, width, height);
        
        this.setRectangleDropZone(width, height);

        // temporalmente para ver zona
        const graphics = this.scene.add.graphics();
        graphics.lineStyle(2, 0xffff00);
        graphics.strokeRect(this.x - this.input.hitArea.width / 2, this.y - this.input.hitArea.height / 2, this.input.hitArea.width, this.input.hitArea.height);
        ////////////////////////////////////////////////////////////////////////////////
        
        this.scene.add.existing(this);
    }

    resize(x: number, y: number, width: number, height: number){
        this.setPosition(x, y);
        this.setSize(width, height);
        //setRectangleDropZone tal vez de error
        this.setRectangleDropZone(width, height);
    }

    getBgSprite(): Phaser.GameObjects.Sprite{
        return this.bgSprite;
    }

    getObjectSprite(): Phaser.GameObjects.Sprite{
        return this.objectSprite;
    }

    setObjectSprite(sprite: Phaser.GameObjects.Sprite){
        this.objectSprite = sprite;
    }

    setBgSprite(sprite: Phaser.GameObjects.Sprite){
        this.bgSprite = sprite;
    }
}