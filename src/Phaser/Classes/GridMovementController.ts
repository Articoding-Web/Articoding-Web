import { Direction } from "../types/Direction";
import { Player } from "./Player";

export class GridMovementController {
    constructor(
        private player: Player,
        private input: Phaser.Input.InputPlugin,
    ) { }

    update() {
        const cursors = this.input.keyboard.createCursorKeys();
        if (cursors.left.isDown) {
            this.player.movePlayer(Direction.LEFT);
        } else if (cursors.right.isDown) {
            this.player.movePlayer(Direction.RIGHT);
        } else if (cursors.up.isDown) {
            this.player.movePlayer(Direction.UP);
        } else if (cursors.down.isDown) {
            this.player.movePlayer(Direction.DOWN);
        }
    }
}