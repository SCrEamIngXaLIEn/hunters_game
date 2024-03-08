import Phaser from 'phaser'

import Game from './Scenes/Game'
import UI from './Scenes/UI'

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
	scene: [Game, UI],
	backgroundColor: 0x34a1eb,
	title: 'Star Hunters',
    version: '0.2.0-a'
}

export default new Phaser.Game(config)
