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
            this.load.spritesheet('player', 'assets/sprites/player.png', { frameWidth: 32, frameHeight: 48 });
        }

        // Create animations
        createAnimations() {
            this.anims.create({
                key: 'left',
                frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: 'right',
                frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
                frameRate: 10,
                repeat: -1
            });
            this.anims.create({
                key: 'turn',
                frames: [ { key: 'player', frame: 4 } ],
                frameRate: 20
            });
        }

        create ()
        {
            this.createAnimations();

            // Create background gradient
            const graphics = this.add.graphics();
            graphics.fillGradientStyle(0x169ac5, 0x169ac5, 0x9addf3, 0x9addf3, 1);
            graphics.fillRect(0, 0, 800, 600);

            // Create title screen images
            this.add.image(400, 175, 'title');

            // Create player sprite
            gameState.player = this.physics.add.sprite(220, 512, 'player');
            gameState.player.setBounce(0.2);

            // Create ground
            const ground = this.physics.add.staticGroup();
            ground.create(400, 576, 'ground').setScale(2.5).refreshBody();

            // Create Stars button
            const start = this.physics.add.staticGroup();
            start.create(400, 365, 'start');

            // Colliders
            gameState.player.setCollideWorldBounds(true);
            this.physics.add.collider(gameState.player, ground);

            // Create keyboard keys for this scene
            gameState.cursors = this.input.keyboard.createCursorKeys();
            gameState.cursors.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
            gameState.cursors.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
            gameState.cursors.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
            gameState.cursors.SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

            // Starts game
            this.physics.add.collider(gameState.player, start, () => {
                this.scene.stop('StartScene');
                this.scene.start('GameScene');                
            });

            // Game version text
            const versionText = this.add.text(25, 550, '', { font: '16px Cursive', fill: "#fff"});
            versionText.setText([
                `Game Title: ${game.config.gameTitle}`,
                `Version: ${game.config.gameVersion}`
            ])
        }

        update ()
        {
            if (gameState.cursors.left.isDown || gameState.cursors.A.isDown) {
                gameState.player.setVelocityX(-gameState.speed);
                gameState.player.anims.play('left', true);
            } else if (gameState.cursors.right.isDown || gameState.cursors.D.isDown) {
                gameState.player.setVelocityX(gameState.speed);
                gameState.player.anims.play('right', true);
            } else {
                gameState.player.setVelocityX(0);  
                gameState.player.anims.play('turn');
            }
            if (gameState.player.body.touching.down){
                if (gameState.cursors.up.isDown || gameState.cursors.W.isDown) {
                    gameState.player.setVelocityY(-gameState.gameOptions.gravity / 1.25);
                }
            }
        }
    }