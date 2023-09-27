import * as Phaser from 'phaser';
import LevelEditor from './LevelEditor/levelEditor';

const config : Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    backgroundColor: '#125555',
    // width: 800,
    // height: 600,
    width: 14 * 16,
    height: 14 * 16,
    zoom: 4,
    parent: 'phaserDiv',
    scene: LevelEditor,
};

const game = new Phaser.Game(config);


