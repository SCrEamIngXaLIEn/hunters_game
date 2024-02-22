import Phaser from 'phaser';

export default class Game extends Phaser.Scene
{
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    private player?: Phaser.Physics.Matter.Sprite;

    private isTouchingGround = false;

    constructor()
    {
        super('game');
    }

    init()
    {
        this.cursors = this.input.keyboard?.createCursorKeys();
    }

    preload()
    {
        this.load.atlas('player', 'assets/player.png', 'assets/player.json');
        this.load.image('tiles', 'assets/platform_tilesheet.png');
        this.load.tilemapTiledJSON('map1', 'assets/map1.json');
    }

    create()
    {        
        // const { width, height } = this.scale;
        this.createPlayerAnimations();

        // Create tilemap
        const map = this.make.tilemap({ key: 'map1' });
        const tileset = map.addTilesetImage('grassland', 'tiles');

        // Create ground layer
        const ground = map.createLayer('ground', tileset!);
        ground?.setCollisionByProperty({ collide: true });

        // Create objects
        const objectsLayer = map.getObjectLayer('objects');
        objectsLayer?.objects.forEach(objData => {
            const { x = 0, y = 0, name } = objData;

            switch (name)
            {
                case 'playerSpawn':
                {
                    // Create player
                    this.player = this.matter.add.sprite(x, y, 'player')            
                        .play('player-idle')
                        .setScale(0.5)
                        .setFixedRotation();

                    this.player.setOnCollide((_data: MatterJS.ICollisionPair) => {
                        this.isTouchingGround = true;
                    })

                    // Set up cameras
                    this.cameras.main.startFollow(this.player, true, 0.5, 0.5);
                    break;
                }
            }
        })
                
        this.matter.world.convertTilemapLayer(ground!);
    }

    update()
    {   
        if (!this.player)
        {
            return;
        }

        let speed = 5;

        // Controls player movement
        if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-speed)
                .play('player-walk', true)
                .flipX = true;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(speed)
                .play('player-walk', true)
                .flipX = false;
        }
        else
        {
            this.player.setVelocityX(0)
                .play('player-idle');
        }

        const spacePressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);
        if (this.isTouchingGround)
        {
            if (spacePressed)
            {
                this.player.setVelocityY(-12)
                .play('player-jump', true);
                this.isTouchingGround = false;
            }
            if (this.cursors.shift.isDown) 
            {
                speed = 7;
            } 
            else
            {
                speed = 5;
            }
        }

    }

    // Create player animations
    private createPlayerAnimations()
    {
        this.anims.create({
            key: 'player-idle',
            frames: [{ key: 'player', frame: 'platformChar_idle.png' }]
        });

        this.anims.create({
            key: 'player-walk',
            frames: this.anims.generateFrameNames('player', { 
                start: 1,
                end: 2,
                prefix: 'platformChar_walk',
                suffix: '.png'
            }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'player-jump',
            frames: [{ key: 'player', frame: 'platformChar_jump.png' }]
        });
    }    
}