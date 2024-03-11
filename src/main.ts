import Phaser from 'phaser';
import gameConfig from './gameConfig';

import Start from './Scenes/Start';
import Game from './Scenes/Game';
import UI from './Scenes/UI';

export const game = new Phaser.Game({
    ...gameConfig,
    scene: [Start, Game, UI],
});