class GameScene extends Phaser.Scene
    {
        constructor(key) {
            super(key);
            this.levelKey = key
            this.nextLevel = {
                'Level1': 'Level2',
                'Level2': 'Level3',
                'Level3': 'EndScene'
            };
            this.data = { score: 0 };
        }

        preload () {
            this.load.image('ground', 'assets/sprites/platform.png');
            this.load.image('star', 'assets/sprites/star.png');
            this.load.image('bomb', 'assets/sprites/bomb.png');
            this.load.image('clouds', 'assets/backgrounds/clouds.png');
            this.load.image('hills', 'assets/backgrounds/hills.png');
            this.load.image('mountains', 'assets/backgrounds/mountains.png');
            this.load.image('controls', 'assets/controls.png');
            this.load.spritesheet('player', 'assets/sprites/player.png', { frameWidth: 32, frameHeight: 48 });
        }
                             
        create () {

            this.initialize();
            
            // Create backgrounds
            gameState.bgColor = this.add.rectangle(0, 0, gameState.gameOptions.levelWidth, gameState.gameOptions.levelHeight, 0x00ffbb).setOrigin(0, 0);
            gameState.bgColor.setPipeline('Light2D');
            this.createBackgrounds();

            // Create player sprite
            gameState.player = this.physics.add.sprite(220, 1112, 'player').setPipeline('Light2D');
            gameState.player.setBounce(0.2);
            gameState.player.setScale(1.2);            
            gameState.playerLight = this.lights.addLight(0, 0, 100, 0xfff5be, 0.5);
                        
            // Create ground
            gameState.ground = this.physics.add.staticGroup();
            gameState.ground.create(800, 1216, 'ground').setScale(4).refreshBody().setPipeline('Light2D');

            // Create platforms
            gameState.platforms = this.physics.add.staticGroup();

            this.createAnimations();

            this.levelSetup();

            // Creates stars
            gameState.stars = this.physics.add.group({
                key: 'star',
                repeat: 11,
                setXY: { x: 12, y: 0, stepX: 140 },
            });           
            gameState.stars.children.iterate(child => {
                child.setVelocityX(25);
                child.setBounceY(Phaser.Math.FloatBetween(0.2, 0.4));
                child.setCollideWorldBounds(true);
            });

            // Creates bombs
            gameState.bombs = this.physics.add.group();
            
            // Creates score text
            gameState.scoreText = this.add.text(16, 16, `Score: ${gameState.score}`, { font: '28px Cursive', fill: '#000' }).setScrollFactor(0);
            gameState.highScoreText = this.add.text(16, 48, `High Score: ${gameState.highScore}`, { font: '28px Cursive', fill: '#000'}).setScrollFactor(0);
            
            // Set up cameras
            this.cameras.main.setBounds(0, 0, gameState.gameOptions.levelWidth, gameState.gameOptions.levelHeight);
            this.physics.world.setBounds(0, 0, gameState.gameOptions.levelWidth, gameState.gameOptions.levelHeight);
            this.cameras.main.startFollow(gameState.player, true, 0.5, 0.5);

            // Colliders
            gameState.player.setCollideWorldBounds(true);
            this.physics.add.collider(gameState.player, gameState.platforms);
            this.physics.add.collider(gameState.player, gameState.ground);
            this.physics.add.collider(gameState.stars, gameState.platforms, this.stopStarsX, null, this);
            this.physics.add.collider(gameState.stars, gameState.ground, this.stopStarsX, null, this);
            this.physics.add.collider(gameState.bombs, gameState.platforms);
            this.physics.add.collider(gameState.bombs, gameState.ground);

            // Logic for handling when player collides with stars or bombs
            this.physics.add.collider(gameState.player, gameState.bombs, this.handleStarAndBomb, null, this);
            this.physics.add.overlap(gameState.player, gameState.stars, this.handleStarAndBomb, null, this);
                        
            // Create keyboard keys for this scene
            gameState.cursors = this.input.keyboard.createCursorKeys();
            gameState.cursors.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
            gameState.cursors.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
            gameState.cursors.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
            gameState.cursors.SPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
            gameState.cursors.ESC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
            gameState.cursors.SHIFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

            // Toggle pause
            this.input.keyboard.on('keydown-ESC', () => {
               this.togglePause();
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
                    if (gameState.cursors.up.isDown || gameState.cursors.W.isDown || gameState.cursors.SPACE.isDown) {
                        gameState.player.setVelocityY(-gameState.gameOptions.gravity / 1.25);
                    }
                    if (gameState.cursors.SHIFT.isDown) {
                        gameState.speed = 320;
                    } else {
                        gameState.speed = 160;
                    }
                }

                // Disables collision with platforms when the plater is moving up
                if (gameState.player.body.velocity.y < 0) {
                    gameState.player.body.checkCollision.up = false;                    
                } else {
                    gameState.player.body.checkCollision.up = true;
                }
                
                // Changes level based on player score
                const scoreMultiple = Math.floor(gameState.score / 480);
                if (scoreMultiple > gameState.currentLevel) {
                    gameState.currentLevel = scoreMultiple;
                    
                    this.cameras.main.fade(800, 0, 0, 0, false, function(camera, progress) {                        
                        gameState.player.anims.play('turn');
                        this.physics.pause();
                        if (progress > .9) {                            
                            this.data.set('score', gameState.score);
                            this.scene.stop(this.levelKey);
                            this.scene.start(this.nextLevel[this.levelKey]);                         
                        }
                    });
                }
            } 
            gameState.playerLight.x = gameState.player.x;
            gameState.playerLight.y = gameState.player.y;
        }
        
        initialize() {
            // Enable lights and set ambient color
            this.lights.enable();            
            this.lights.setAmbientColor(0xffffff);
            
            // Ensures game is not paused on start
            gameState.isPaused = false;

            // Variables for center of screen
            gameState.centerX = gameState.gameOptions.width / 2;
            gameState.centerY = gameState.gameOptions.height / 2;
        }
                                        
        // Creates background layers
        createBackgrounds() {
            gameState.bg1 = this.add.image(0, 150, 'mountains').setOrigin(0, 0);
            gameState.bg2 = this.add.image(0, 150, 'hills').setOrigin(0, 0);
            gameState.bg3 = this.add.image(0, 0, 'clouds').setOrigin(0, 0);
            
            const levelWidth = gameState.gameOptions.levelWidth;

            const bg1_width = gameState.bg1.getBounds().width;
            const bg2_width = gameState.bg2.getBounds().width;
            const bg3_width = gameState.bg3.getBounds().width;
                        
            gameState.bg1.setScrollFactor((bg1_width - config.width) / (levelWidth - config.width));
            gameState.bg2.setScrollFactor((bg2_width - config.width) / (levelWidth - config.width));
            gameState.bg3.setScrollFactor((bg3_width - config.width) / (levelWidth - config.width));

            gameState.bg2.setPipeline('Light2D');
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

        // Utility function to create platforms
        createPlatform(x, y) {
            gameState.platforms.create((233.5 * x), y * 70, 'ground').setOrigin(0, 0.5).setScale(0.5).refreshBody();
        }

        // Method to set weather
        setWeather(scene, weather) {
            const weathers = {
                'morning': { 'color': 0xecdccc, 'bgColor': 0xF8c3aC },
                'afternoon': { 'color': 0xffffff, 'bgColor': 0x0571FF },
                'night': { 'color': 0xccaacc, 'bgColor': 0x18235C }
            };
            let { color, bgColor } = weathers[weather];
            [
                gameState.bg1, 
                gameState.bg2, 
                gameState.bg3, 
                gameState.player, 
                gameState.ground
            ].forEach(element => element.setTint(color));
            gameState.bgColor.fillColor = bgColor;
            for (let platform of gameState.platforms.getChildren()) {
                platform.setTint(color);
            }
        }

        levelSetup(weather = 'morning') {
            const platformPos = this.platformPos || [];
            platformPos.forEach(pos => {
                this.createPlatform(pos.x, pos.y);
            });
        
            this.setWeather(this, weather);
        }

        // Method to stars from moving 
        // in the X direction upon landing
        stopStarsX(star, ground) {
            star.setVelocityX(0);
        }

        // Logic for player interacting with stars and bombs
        handleStarAndBomb(player, item) {
            if (item.texture.key === 'star') {
                item.disableBody(true, true);

                // Adds to score when a star is collected
                gameState.score += 10;
                gameState.scoreText.setText(`Score: ${gameState.score}`);
                if (gameState.score > gameState.highScore) {
                    gameState.highScore = gameState.score;
                    gameState.highScoreText.setText(`High Score: ${gameState.highScore}`);
                }

                // Generates new stars when all the current stars are collected
                if (gameState.stars.countActive(true) === 0) {
                    gameState.stars.children.iterate(function (child) {
                        child.enableBody(true, child.x, 0, true, true);
                    });
                
                    // Creates a new bomb each time all the stars are collected
                    let x = (gameState.player.x < 800) ? Phaser.Math.Between(800, 1600) : Phaser.Math.Between(0, 800);
                    let y = Phaser.Math.Between(600, 16);

                    let bomb = gameState.bombs.create(x, y, 'bomb');
                    bomb.setBounce(1);
                    bomb.setCollideWorldBounds(true);
                    bomb.setVelocity(Phaser.Math.Between(-400, 400), Phaser.Math.Between(-400, 400));
                    bomb.setGravity(0, -gameState.gameOptions.gravity);
                    bomb.setPipeline('Light2D');
                }
            }

            if (item.texture.key === 'bomb') {
                this.physics.pause();
                player.setTint(0xff0000);
                player.anims.play('turn');
                this.scene.stop(this.levelKey);
                this.scene.start('EndScene');
            }
        }

        // Method to toggle pause screen
        togglePause() {
            if (gameState.isPaused === false) {
                gameState.isPaused = true;
                gameState.player.anims.play('turn');
                this.physics.pause();
                this.pauseScreen();
            } else {
                gameState.isPaused = false;
                this.physics.resume();
                this.pauseScreen();
            }
        }

        // Display and remove pause screen
        pauseScreen () {
            if (gameState.isPaused) {
                 gameState.pauseOverlay = this.add.rectangle(gameState.centerX, gameState.centerY, 750, 400, 0xFFFFFF).setScrollFactor(0);
                 gameState.pauseOverlay.alpha = 0.75;
                 gameState.pauseOverlay.setOrigin(0.5, 0.5);
                 
                 gameState.pauseOverlay.pauseText = this.add.text(gameState.centerX, 125, 'PAUSED', { font: '32px Cursive', fill: '#000' }).setScrollFactor(0).setOrigin(0.5);
                 gameState.pauseOverlay.menuText = this.add.text(gameState.centerX, 175, 'Main Menu', { font: '32px Cursive', fill: '#000' }).setScrollFactor(0).setOrigin(0.5).setInteractive();
                 gameState.pauseOverlay.controls = this.add.image(gameState.centerX, gameState.centerY + 17, 'controls').setOrigin(0.5, 0.5).setScrollFactor(0).setScale(0.75);
                 gameState.pauseOverlay.resumeText = this.add.text(gameState.centerX, 470, 'Press ESC to resume game', { font: '32px Cursive', fill: '#000' }).setScrollFactor(0).setOrigin(0.5);
                 
                 gameState.pauseOverlay.menuText.on('pointerdown', () => {
                     gameState.pauseOverlay.menuText.setScale(0.85);
                     gameState.pauseOverlay.menuText.on('pointerup', () => {
                         this.physics.pause();
                         gameState.player.anims.play('turn');
                         this.scene.stop(this.levelKey);
                         this.scene.start('StartScene'); 
                     })
                 })

                 this.input.setHitArea(gameState.pauseOverlay.menuText).on('gameobjectover', function(pointer, gameObject) {
                     gameObject.setScale(1.1);
                 })
                 this.input.setHitArea(gameState.pauseOverlay.menuText).on('gameobjectout', function(pointer, gameObject) {
                     gameObject.setScale(1);
                 })

             } else {
                 gameState.pauseOverlay.destroy();
                 gameState.pauseOverlay.pauseText.destroy();
                 gameState.pauseOverlay.menuText.destroy();
                 gameState.pauseOverlay.controls.destroy();
                 gameState.pauseOverlay.resumeText.destroy();
             }
         }

        // Retrieves the score stored between each level
        retrieveStoredScore() {
            gameState.score = this.data.score || 0; // If no score is stored, default to 0
        } 
    }

    class Level1 extends GameScene {
        constructor() {
            super('Level1');
            this.platformPos = [
                { x: 0, y: 14 },
                { x: 1, y: 12 },
                { x: 2, y: 10 },
                { x: 4, y: 10 },
                { x: 5, y: 12 },
                { x: 6, y: 14 },
            ];
            this.retrieveStoredScore();
            this.weather = 'morning';
        }
    
        create() {
            super.create();
            this.levelSetup(this.weather);
            gameState.playerLight.setIntensity(0.5);
        }
    }
    
class Level2 extends GameScene 
    {
        constructor() {
            super('Level2');
            this.platformPos = [
                { x: 0, y: 10 },
                { x: 1, y: 12 },
                { x: 2, y: 10 },
                { x: 3, y: 14 },
                { x: 4, y: 10 },
                { x: 5, y: 12 },
                { x: 6, y: 10 }
            ];
            this.retrieveStoredScore();
            this.weather = 'afternoon';          
        }

        create() {
            super.create();
            this.levelSetup(this.weather);
            gameState.playerLight.setVisible(false);
        }
    }

class Level3 extends GameScene
    {
        constructor() {
            super('Level3');
            this.platformPos = [
                { x: 0, y: 12 },
                { x: 1, y: 8 },
                { x: 2, y: 4 },
                { x: 2, y: 12 },
                { x: 3, y: 14 },                
                { x: 3, y: 10 },
                { x: 3, y: 6 },
                { x: 4, y: 4 },
                { x: 4, y: 12 },
                { x: 5, y: 8 },
                { x: 6, y: 12 }
            ];
            this.retrieveStoredScore();
            this.weather = 'night';                        
        }

        create() {
            super.create();
            this.levelSetup(this.weather);
            gameState.playerLight.setIntensity(1);
        }
    }