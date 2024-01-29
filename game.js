const gameState = {
    gameOptions: {
        width: 800,
        height: 600,
        gravity: 575,
        levelWidth: 1600,
        levelHeight: 1200
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
    scene: [StartScene, Level1, Level2, EndScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: gameState.gameOptions.gravity },
            enableBody: true
        }
    },
    title: 'Star Hunters',
    version: '0.0.3-a'
};

const game = new Phaser.Game(config);