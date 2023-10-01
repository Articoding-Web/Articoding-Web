import * as Phaser from 'phaser';
import LevelEditor from './LevelEditor/levelEditor';

const config : Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor: '#16161D',
    // width: 800,
    // height: 600,
    width: 14 * 70,
    height: 14 * 50,
    zoom: 1,
    parent: 'phaserDiv',
    scene: LevelEditor,
};
 

const game = new Phaser.Game(config);


