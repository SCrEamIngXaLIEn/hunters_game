import Phaser from "phaser";
import StateMachine from "../statemachine/stateMachine";

type CursorKeys = Phaser.Types.Input.Keyboard.CursorKeys;

export default class PlayerController
{
    private sprite: Phaser.Physics.Matter.Sprite;
    private cursors: CursorKeys;

    private stateMachine: StateMachine;

    constructor(sprite: Phaser.Physics.Matter.Sprite, cursors: CursorKeys)
    {
        this.sprite = sprite;
        this.cursors = cursors;

        this.createAnimations();

        this.stateMachine = new StateMachine(this, 'player');

        this.stateMachine.addState('idle', {
            onEnter: this.idleOnEnter,
            onUpdate: this.idleOnUpdate
        })
        .addState('walk', {
            onEnter: this.walkOnEnter,
            onUpdate: this.walkOnUpdate
        })
        .addState('jump', {
            onEnter: this.jumpOnEnter,
            onUpdate: this.jumpOnUpdate
        })
        .setState('idle');

        this.sprite.setOnCollide((_data: MatterJS.ICollisionPair) => {
            if (this.stateMachine.isCurrentState('jump'))
            {
                this.stateMachine.setState('idle');
            }
        })
    }

    update(dt: number)
    {
        this.stateMachine.update(dt);
    }

    // Controls idle state
    private idleOnEnter()
    {
        this.sprite.play('player-idle');
    }
    private idleOnUpdate()
    {
        if (this.cursors.left.isDown || this.cursors.right.isDown)
        {
            this.stateMachine.setState('walk');
        }

        this.spacePressed();
    }

    // Controls player movement
    private walkOnEnter()
    {
        this.sprite.play('player-walk')
    }
    private walkOnUpdate()
    {
        this.movement();        
        this.spacePressed();        
    }

    // Controls jump
    private jumpOnEnter()
    {
        this.sprite.setVelocityY(-14.4);
        this.sprite.play('player-jump');
    }
    private jumpOnUpdate()
    {
        const speed = 5;

        if (this.cursors.left.isDown)
        {
            this.sprite.setVelocityX(-speed)
                .flipX = true;
        }
        else if (this.cursors.right.isDown)
        {
            this.sprite.setVelocityX(speed)
                .flipX = false;
        };
    }

    // Create player animations
    private createAnimations()
    {
        this.sprite.anims.create({
            key: 'player-idle',
            frames: [{ key: 'player', frame: 'player_idle.png' }]
        });

        this.sprite.anims.create({
            key: 'player-walk',
            frames: this.sprite.anims.generateFrameNames('player', { 
                start: 1,
                end: 2,
                prefix: 'player_run',
                suffix: '.png'
            }),
            frameRate: 10,
            repeat: -1
        });

        this.sprite.anims.create({
            key: 'player-jump',
            frames: [{ key: 'player', frame: 'player_jump.png' }]
        });
    }

    private movement(speed: number = 5)
    {        
        if (this.cursors.left.isDown)
        {
            this.sprite.setVelocityX(-speed)
                .flipX = true;
        }
        else if (this.cursors.right.isDown)
        {
            this.sprite.setVelocityX(speed)
                .flipX = false;
        }
        else
        {
            this.sprite.setVelocityX(0);
            this.stateMachine.setState('idle');
        }
    }

    private spacePressed()
    {
        const spacePressed = Phaser.Input.Keyboard.JustDown(this.cursors.space);        
        if (spacePressed)
        {
            this.stateMachine.setState('jump');
        }
    }
}