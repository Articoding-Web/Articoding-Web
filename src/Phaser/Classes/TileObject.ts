import * as Phaser from "phaser";

export default class TileObject extends Phaser.GameObjects.Sprite {
    occupied: Boolean = false;

    constructor( scene: Phaser.Scene, x: number, y: number,
        texture: string | Phaser.Textures.Texture){
        super(scene, x, y, texture);
        this.scene = scene;

        this.setInteractive();
        this.input!.dropZone = true;
        this.scene.add.existing(this);
    }
}
