import Phaser from 'phaser'

import Game from './Scenes/Game'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 800,
	height: 600,
	physics: {
		default: 'matter',
		arcade: {
			gravity: { y: 575 },
		},
	},
	scene: [Game],
	title: 'Star Hunters',
    version: '0.2.0-a'
}

export default new Phaser.Game(config)
