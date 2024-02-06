class StartScene extends Phaser.Scene
    {
        constructor() {
            super({ key: 'StartScene' });
        }

        preload ()
        {
            this.load.image('title', 'assets/title.png');
            this.load.image('start', 'assets/start.png');
        }
        
        create ()
        {
            gameState.isPaused = false;
                        
            // Create background gradient
            gameState.backgrond = this.add.graphics();
            gameState.backgrond.fillGradientStyle(0x169ac5, 0x169ac5, 0x9addf3, 0x9addf3, 1);
            gameState.backgrond.fillRect(0, 50, 800, 500);

            // Create title screen images
            this.add.image(config.width / 2, 190, 'title').setScale(0.85).setOrigin(0.5);

            // Create Start button
            buttons.start = this.add.image(config.width / 2, 365, 'start').setInteractive().setOrigin(0.5);

            // Creates Controls button
            buttons.controls = this.add.text(config.width / 2, 420, 'Controls', { font: '24px Cursive', fill: '#fff' }).setInteractive().setOrigin(0.5);
                        
            // Game version text
            const versionText = this.add.text(15, 554, '', { font: '16px Cursive', fill: "#fff"});
            versionText.setText([
                `Game Title: ${game.config.gameTitle}`,
                `Version: ${game.config.gameVersion}`
            ])

            // Sets button size and tint on hover
            buttons.start.on('pointerover', () => {
                buttons.start.setTint(0xFFE948);
                buttons.start.setScale(1.1);
            })
            buttons.start.on('pointerout', () => {
                buttons.start.clearTint();
                buttons.start.setScale(1);
            })
            buttons.controls.on('pointerover', () => {
                buttons.controls.setTint(0xFFE948);
                buttons.controls.setScale(1.1);
            })
            buttons.controls.on('pointerout', () => {
                buttons.controls.clearTint();
                buttons.controls.setScale(1);
            })

            // Starts game
            buttons.start.on('pointerdown', () => {
                buttons.start.setScale(0.85);
                buttons.start.on('pointerup', () => {
                    this.scene.stop('StartScene');
                    this.scene.start('Level1');
                })
            })

            // Open Controls screen
            buttons.controls.on('pointerdown', () => {
                buttons.controls.setScale(0.85);
                buttons.controls.on('pointerup', () => {
                    this.scene.stop('StartScene');
                    this.scene.start('Controls');
                })
            })
        }
    }

class Controls extends Phaser.Scene
    {
        constructor() {
            super({ key: 'Controls' });
        }

        preload() {
            this.load.image('controls', 'assets/controls.png');
        }

        create() {
            gameState.isPaused = false;
                        
            // Create background gradient
            gameState.backgrond = this.add.graphics();
            gameState.backgrond.fillGradientStyle(0x169ac5, 0x169ac5, 0x9addf3, 0x9addf3, 1);
            gameState.backgrond.fillRect(0, 50, 800, 500);

            gameState.displayBox = this.add.rectangle(config.width / 2, config.height / 2, 750, 400, 0xFFFFFF);
                    gameState.displayBox.alpha = 0.75;
                    gameState.displayBox.setOrigin(0.5, 0.5);

            this.add.image(config.width / 2, config.height / 2 - 20, 'controls').setOrigin(0.5, 0.5);

            // Creates Controls button
            buttons.main = this.add.text(120, 470, 'Back', { font: '32px Cursive', fill: '#000' }).setOrigin(0.5, 0.5);                        
            buttons.main.setInteractive();

            // Create Start Game button
            buttons.start = this.add.text(670, 470, 'Start', { font: '32px Cursive', fill: '#000' }).setOrigin(0.5, 0.5);
            buttons.start.setInteractive();

            // Sets button size and tint on hover
            buttons.main.on('pointerover', () => {
                buttons.main.setScale(1.1);
            })
            buttons.main.on('pointerout', () => {
                buttons.main.setScale(1);
            })
            buttons.start.on('pointerover', () => {
                buttons.start.setScale(1.1);
            })
            buttons.start.on('pointerout', () => {
                buttons.start.setScale(1);
            })

            // Returns to Main Menu
            buttons.main.on('pointerdown', () => {
                buttons.main.setScale(0.85);
                buttons.main.on('pointerup', () => {
                    this.scene.stop('Controls');
                    this.scene.start('StartScene');
                });
            })

            // Starts game
            buttons.start.on('pointerdown', () => {
                buttons.start.setScale(0.85);
                buttons.start.on('pointerup', () => {
                    this.scene.stop('Controls');
                    this.scene.start('Level1');
                });
            })

            buttons.main.input.hitArea.setTo(100, 0, buttons.main.width, buttons.main.height);
            buttons.start.input.hitArea.setTo(-95, 0, buttons.start.width, buttons.start.height);

            // Game version text
            const versionText = this.add.text(15, 554, '', { font: '16px Cursive', fill: "#fff"});
            versionText.setText([
                `Game Title: ${game.config.gameTitle}`,
                `Version: ${game.config.gameVersion}`
            ])            
        }
    }