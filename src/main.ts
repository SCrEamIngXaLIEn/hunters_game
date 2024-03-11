import Phaser from 'phaser';
import gameConfig from './gameConfig';

import Start from './Scenes/Start';
import Controls from './Scenes/Controls';
import Game from './Scenes/Game';
import UI from './Scenes/UI';

export const game = new Phaser.Game({
    ...gameConfig,
    scene: [Start, Controls, Game, UI],
});