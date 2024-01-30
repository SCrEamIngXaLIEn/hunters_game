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
    scoreText: '',
    currentLevel: 0
};

const config = {
    type: Phaser.AUTO,
    width: gameState.gameOptions.width,
    height: gameState.gameOptions.height,
    scene: [StartScene, Level1, Level2, Level3, EndScene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: gameState.gameOptions.gravity },
            enableBody: true
        }
    },
    title: 'Star Hunters',
    version: '0.0.4-a'
};

const game = new Phaser.Game(config);