class EndScene extends Phaser.Scene
    {
        constructor() {
            super ({ key: 'EndScene'} );
        }

        preload () {
            this.load.image('gameOver', 'assets/gameover.png');
        }

        create  () {
            // Create background gradient
            const graphics = this.add.graphics();
            graphics.fillGradientStyle(0x169ac5, 0x169ac5, 0x9addf3, 0x9addf3, 1);
            graphics.fillRect(0, 0, 800, 600);

            // Create world assets;
            this.add.image(400, 200, 'gameOver');

            // Show final score
            this.add.text(270, 330, `Final Score: ${gameState.score}`, { font: '32px Cursive', fill: '#000' });
            this.add.text(270, 370, `High Score: ${gameState.highScore}`, { font: '32px Cursive', fill: '#000' });
                    
            // Start new game
            this.add.text(270, 550, '           Click to Play Again\nor press ESC for the Main Menu', { font: '16px Cursive', fill: '#000'});
            this.input.on('pointerup', () => {
                this.scene.stop('EndScene');
                this.scene.start('Level1');
            })

            // Return to start screen
            this.input.keyboard.on('keydown-ESC', () => {
                this.scene.stop('EndScene');
                this.scene.start('StartScene');
            })
        }
    }