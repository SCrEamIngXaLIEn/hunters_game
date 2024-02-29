import Phaser from 'phaser';
import StateMachine from '../statemachine/stateMachine';
import PlayerController from '../Game/PlayerController';

export default class Game extends Phaser.Scene
{
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    private player?: Phaser.Physics.Matter.Sprite;
    private playerController?: PlayerController;
 
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
        // Create tilemap
        const map = this.make.tilemap({ key: 'map1' });
        const tileset = map.addTilesetImage('grassland', 'tiles');

        // Set world bounds
        this.matter.world.setBounds(0, 0, 2240, 1600, 64, true, true, false, true);

        // Create ground layer
        const ground = map.createLayer('ground', tileset!);
        ground?.setCollisionByProperty({ collide: true });

        // Create platform layer
        const platform = map.createLayer('platforms', tileset!);
        platform?.setCollisionByProperty({ collide: true });

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
                        .setFixedRotation();

                    this.playerController = new PlayerController(this.player, this.cursors);
                    
                    // Set up cameras
                    this.cameras.main.setBounds(0, 0, 2240, 1600);
                    this.cameras.main.startFollow(this.player, true, 0.5, 0.5);
                    break;
                }
            }
        })
                
        this.matter.world.convertTilemapLayer(ground!);
        this.matter.world.convertTilemapLayer(platform!);
    }

    update(t: number, dt: number)
    {           
        if (!this.playerController)
        {
            return;
        }
        

        this.playerController.update(dt);
    }   
}