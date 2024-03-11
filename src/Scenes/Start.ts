import Phaser from "phaser";
import gameConfig from '../gameConfig';

export default class Start extends Phaser.Scene
{
    constructor()
    {
        super('start');
    }

    preload()
    {
        this.load.image('title', 'assets/title.png');
        this.load.image('start', 'assets/start.png');
    }

    create()
    {
        // Import gameConfig directly here
        const horCenter = 800 / 2;
        
        // Create background
        const background = this.add.graphics();
        background.fillGradientStyle(0x169ac5, 0x169ac5, 0x9addf3, 0x9addf3, 1)
            .fillRect(0, 50, 800, 500);
     
        // Create title screen images
        this.add.image(horCenter, 190, 'title').setScale(0.85).setOrigin(0.5);

        // Create Start button
        const start = this.add.image(horCenter, 365, 'start').setInteractive().setOrigin(0.5);
        
        // Create controls button
        const controls = this.add.text(horCenter, 420, 'Controls', { font: '24px Cursive', fill: '#fff' }).setInteractive().setOrigin(0.5);
        
        // Game version text
        const versionText = this.add.text(15, 554, '', { font: '16px Cursive', fill: "#fff"});
            versionText.setText([
                `Game Title: ${gameConfig.title}`,
                `Version: ${gameConfig.version}`
            ])

        // Sets button size and tint on hover
        start.on('pointerover', () => {
            start.setTint(0xFFE948)
            .setScale(1.1);
        })
        start.on('pointerout', () => {
            start.clearTint()
            .setScale(1);
        })
        controls.on('pointerover', () => {
            controls.setTint(0xFFE948)
            .setScale(1.1);
        })
        controls.on('pointerout', () => {
            controls.clearTint()
            .setScale(1);
        })

        // Starts game
        start.on('pointerdown', () => {
            this.scene.stop('Start');
            this.scene.start('game');
        })
    }
}