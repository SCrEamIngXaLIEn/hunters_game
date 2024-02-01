class StartScene extends Phaser.Scene
    {
        constructor() {
            super({ key: 'StartScene' });
        }

        preload ()
        {
            this.load.image('title', 'assets/title.png');
            this.load.image('ground', 'assets/sprites/platform.png');
            this.load.image('start', 'assets/start.png');
        }
        
        create ()
        {
            gameState.isPaused = false;
            
            // Create background gradient
            const graphics = this.add.graphics();
            graphics.fillGradientStyle(0x169ac5, 0x169ac5, 0x9addf3, 0x9addf3, 1);
            graphics.fillRect(0, 0, 800, 600);

            // Create title screen images
            this.add.image(400, 175, 'title');

            // Create ground
            const ground = this.physics.add.staticGroup();
            ground.create(400, 576, 'ground').setScale(2.5).refreshBody();
            
            // Create Stars button
            const start = this.add.image(400, 365, 'start').setInteractive();
            
            // Starts game
            start.on('pointerdown', () => {
                start.setScale(0.85);
                start.on('pointerup', () => {
                    this.scene.stop('StartScene');
                    this.scene.start('Level1');
                })
            })

            // Sets tint of start button when pointer is hovering
            this.input.setHitArea(start).on('gameobjectover', function(pointer, gameObject) {
                gameObject.setTint(0xFFE948);
                gameObject.setScale(1.1);
            })
            this.input.setHitArea(start).on('gameobjectout', function(pointer, gameObject) {
                gameObject.clearTint();
                gameObject.setScale(1);
            })
            
            // Game version text
            const versionText = this.add.text(25, 550, '', { font: '16px Cursive', fill: "#fff"});
            versionText.setText([
                `Game Title: ${game.config.gameTitle}`,
                `Version: ${game.config.gameVersion}`
            ])
        }
    }