import Phaser from 'phaser';
import { sharedInstance as events } from '../Game/EventCenter';

export default class UI extends Phaser.Scene
{
    private scoreText!: Phaser.GameObjects.Text;
    private highScoreText!: Phaser.GameObjects.Text;
    private score = 0;
    private highScore = 0;

    constructor()
    {
        super('ui');
    }

    init()
    {
        this.score = 0;
    }

    create()
    {        
        this.scoreText = this.add.text(16, 16, 'Score: 0', { font: '28px Cursive' }).setScrollFactor(0);
        this.highScoreText = this.add.text(16, 48, `High Score: ${this.highScore}`, { font: '28px Cursive'}).setScrollFactor(0);

        events.on('star-collected', this.handleStarCollected, this);

        this.events.once(Phaser.Scenes.Events.DESTROY, () => {
            events.on('star-collected', this.handleStarCollected, this);
        });
    }

    private handleStarCollected()
        {
            this.score += 10;
            this.scoreText.text = `Score: ${this.score}`;
            if (this.score > this.highScore)
            {
                this.highScore = this.score;
                this.highScoreText.text = `High Score: ${this.highScore}`;
            }
        }
}