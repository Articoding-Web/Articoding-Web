import * as Phaser from "phaser";

export default class TileObject extends Phaser.GameObjects.Sprite {
    occupied: Boolean; 
    origX: number;
    origY: number;
    scene: Phaser.Scene;

    constructor( scene: Phaser.Scene, x: number, y: number,
        texture: string | Phaser.Textures.Texture, occupied: Boolean){
        super(scene, x, y, texture);
        this.scene = scene;
        this.occupied = occupied;

        this.setInteractive();
        this.input!.dropZone = true;
        this.scene.add.existing(this);
    }

}
