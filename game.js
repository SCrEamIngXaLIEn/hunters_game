const gameState = {
    gameOptions: {
        width: 800,
        height: 600,
        gravity: 575
    },
    isPaused: false,
    speed: 160,
    highScore: 0,
    score: 0,
    scoreText: ''
};

const config = {
    type: Phaser.AUTO,
    width: gameState.gameOptions.width,
    height: gameState.gameOptions.height,
    scene: [StartScene, GameScene, EndScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: gameState.gameOptions.gravity }
        }
    },
    title: 'Star Hunters',
    version: '0.0.1-a'
};

const game = new Phaser.Game(config);