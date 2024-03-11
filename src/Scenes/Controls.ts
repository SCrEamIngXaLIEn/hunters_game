import { GameObjects } from "phaser";
import gameConfig from "../gameConfig";

export default class Controls extends Phaser.Scene
    {
        constructor() {
            super({ key: 'controls' });
        }

        preload() {
            this.load.image('controls', 'assets/controls.png');
        }

        create() {
            const horCenter = gameConfig.width / 2;
            const vertCenter = gameConfig.height / 2;
                        
            // Create background gradient
            const background = this.add.graphics();
            background.fillGradientStyle(0x169ac5, 0x169ac5, 0x9addf3, 0x9addf3, 1)
            .fillRect(0, 50, 800, 500);

            const displayBox = this.add.rectangle(horCenter, vertCenter, 750, 400, 0xFFFFFF);
                displayBox.alpha = 0.75;
                displayBox.setOrigin(0.5, 0.5);

            this.add.image(horCenter, vertCenter - 20, 'controls').setOrigin(0.5, 0.5);

            // Creates Controls button
            const main = this.add.text(120, 470, 'Back', { font: '32px Cursive', color: '#000' }).setOrigin(0.5, 0.5);                        
            main.setInteractive();

            // Create Start Game button
            const start = this.add.text(670, 470, 'Start', { font: '32px Cursive', color: '#000' }).setOrigin(0.5, 0.5);
            start.setInteractive();

            // Sets button size and tint on hover
            main.on('pointerover', () => {
                main.setScale(1.1);
            })
            main.on('pointerout', () => {
                main.setScale(1);
            })
            start.on('pointerover', () => {
                start.setScale(1.1);
            })
            start.on('pointerout', () => {
                start.setScale(1);
            })

            // Returns to Main Menu
            main.on('pointerdown', () => {
                main.setScale(0.85);
                main.on('pointerup', () => {
                    this.scene.stop('controls');
                    this.scene.start('start');
                });
            })

            // Starts game
            start.on('pointerdown', () => {
                start.setScale(0.85);
                start.on('pointerup', () => {
                    this.scene.stop('controls');
                    this.scene.start('game');
                });
            })

            // Game version text
            const versionText = this.add.text(15, 554, '', { font: '16px Cursive', color: "#fff"});
            versionText.setText([
                `Game Title: ${gameConfig.title}`,
                `Version: ${gameConfig.version}`
            ])            
        }
    }