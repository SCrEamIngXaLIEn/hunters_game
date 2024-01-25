class GameScene extends Phaser.Scene
    {
        constructor() {
            super ({ key:'GameScene' });
        }

        preload () {
            this.load.image('ground', 'assets/sprites/platform.png');
            this.load.image('star', 'assets/sprites/star.png');
            this.load.image('bomb', 'assets/sprites/bomb.png');
            this.load.spritesheet('player', 'assets/sprites/player.png', { frameWidth: 32, frameHeight: 48 });
        }

        // Creates platforms
        createPlatform(xIndex, yIndex) {
            if (typeof yIndex === 'number' && typeof xIndex === 'number') {
                gameState.platforms.create((220 * xIndex), yIndex * 70, 'ground').setOrigin(0, 0.5).refreshBody();
            }
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

        create () {
            gameState.score = 0;

            this.createAnimations();

            // Create background gradient
            const graphics = this.add.graphics();
            graphics.fillGradientStyle(0x169ac5, 0x169ac5, 0x9addf3, 0x9addf3, 1);
            graphics.fillRect(0, 0, gameState.gameOptions.levelWidth, gameState.gameOptions.levelHeight);

            // Create player sprite
            gameState.player = this.physics.add.sprite(220, 1112, 'player');
            gameState.player.setBounce(0.2);
            gameState.player.body.checkCollision.up = false;

             // Create ground
             const ground = this.physics.add.staticGroup();
             ground.create(800, 1216, 'ground').setScale(4).refreshBody();

            // Create platforms
            gameState.platforms = this.physics.add.group({
                allowGravity: false,
                immovable: true
            });
            for (let i = 0; i < 12; i++) {
                let randX = Math.floor(Math.random() * 1600) + 50;
                gameState.platforms.create(randX, 150 + (i * 150), 'ground');
                }

            // Create stars
            const stars = this.physics.add.group({
                key: 'star',
                repeat: 11,
                setXY: { x: 12, y: 0, stepX: 70 }
            });

            stars.children.iterate(child => {
                child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
            });

            // Creates bombs
            gameState.bombs = this.physics.add.group();
            // Logic for what happens when a bomb hits the player
            function hitBomb (player, bomb) {
                this.physics.pause();
                player.setTint(0xff0000);
                player.anims.play('turn');
                this.scene.stop('GameScene');
                this.scene.start('EndScene');
                if (gameState.highScore < gameState.score) {
                    gameState.highScore = gameState.score;
                }
            }

            // Creates score text
            gameState.scoreText = this.add.text(16, 16, 'Score: 0', { font: '28px Cursive', fill: '#000' }).setScrollFactor(0);
            this.add.text(16, 48, `High Score: ${gameState.highScore}`, { font: '28px Cursive', fill: '#000'}).setScrollFactor(0);
            
            // Set up cameras
            this.cameras.main.setBounds(0, 0, gameState.gameOptions.levelWidth, gameState.gameOptions.levelHeight);
            this.physics.world.setBounds(0, 0, gameState.gameOptions.levelWidth, gameState.gameOptions.levelHeight);
            this.cameras.main.startFollow(gameState.player, true, 0.5, 0.5);

            // Colliders
            gameState.player.setCollideWorldBounds(true);
            this.physics.add.collider(gameState.player, gameState.platforms);
            this.physics.add.collider(gameState.player, ground);
            this.physics.add.collider(stars, gameState.platforms);
            this.physics.add.collider(stars, ground);
            this.physics.add.collider(gameState.bombs, gameState.platforms);
            this.physics.add.collider(gameState.bombs, ground);
            this.physics.add.collider(gameState.player, gameState.bombs, hitBomb, null, this);

            // Creates logic for player to collect stars when overlaping them
            this.physics.add.overlap(gameState.player, stars, collectStar, null, this);
            function collectStar (player, star) {
                star.disableBody(true, true);

                // Adds to score when a star is collected
                gameState.score += 10;
                gameState.scoreText.setText(`Score: ${gameState.score}`);

                // Generates new stars when all the current stars are collected
                if (stars.countActive(true) === 0) {
                    stars.children.iterate(function (child) {
                        child.enableBody(true, child.x, 0, true, true);
                    });
                
                    // Creates a new bomb each time all the stars are collected
                    let x = (gameState.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

                    let bomb = gameState.bombs.create(x, 16, 'bomb');
                    bomb.setBounce(1);
                    bomb.setCollideWorldBounds(true);
                    bomb.setVelocityY(Phaser.Math.Between(-200, 200), 20);
                    bomb.setVelocityX(Phaser.Math.Between(-150, 150));

                    // Rearranges platforms when all stars are collected
                }
            }

            // Display and remove pause screen
            const togglePauseScreen = () => {
                if (gameState.isPaused) {
                    gameState.pauseOverlay = this.add.rectangle(25, 90, 750, 400, 0xFFFFFF).setScrollFactor(0);
                    gameState.pauseOverlay.alpha = 0.75;
                    gameState.pauseOverlay.setOrigin(0, 0);
                    
                    gameState.pauseOverlay.pauseText = this.add.text(320, 125, 'PAUSED', { font: '32px Cursive', fill: '#000' }).setScrollFactor(0);
                    gameState.pauseOverlay.resumeText = this.add.text(192, 425, 'Press ESC to resume game', { font: '32px Cursive', fill: '#000' }).setScrollFactor(0);
                } else {
                    gameState.pauseOverlay.destroy();
                    gameState.pauseOverlay.pauseText.destroy();
                    gameState.pauseOverlay.resumeText.destroy();
                }
            }

            // Toggle pause function
            const togglePause = () => {
                if (gameState.isPaused === false) {
                    gameState.isPaused = true;
                    gameState.player.anims.play('turn');
                    this.physics.pause();
                    togglePauseScreen();
                } else {
                    gameState.isPaused = false;
                    this.physics.resume();
                    togglePauseScreen();
                }
            }

            // Create keyboard keys for this scene
             gameState.cursors = this.input.keyboard.createCursorKeys();
             gameState.cursors.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
             gameState.cursors.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
             gameState.cursors.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
             gameState.cursors.SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
             gameState.cursors.ESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
            
             // Toggle pause
             this.input.keyboard.on('keydown-ESC', () => {
                togglePause();
            })
        }

        update () {
            if (gameState.isPaused === false) {
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
    }