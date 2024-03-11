import Phaser from 'phaser';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'matter',
        matter: {
            debug: true
        },
    },
    title: 'Star Hunters',
    version: '0.2.0-a'
};

export default config;