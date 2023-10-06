import * as Phaser from 'phaser';
import LevelLoader from './LevelEditor/levelLoader';

const config : Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor: '#16161D',
    // width: 800,
    // height: 600,
    width: 980,
    height: 700,
    zoom: 1,
    parent: 'phaserDiv',
    scene: LevelLoader,
};
const game = new Phaser.Game(config);