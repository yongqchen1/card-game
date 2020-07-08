import Card from '../objects/card';
import io from 'socket.io-client';
import Dealer from '../objects/dealer';
import Zone from '../objects/zone';

export default class Game extends Phaser.Scene {
    constructor() {
        super({
            key: 'Game'
        });
    }

    preload() {
        this.load.image('purplewizard','src/assets/purplewizard.png');
        this.load.image('background','src/assets/background.png');
        this.load.image('back','src/assets/back.png')


        this.load.image('cyanCardFront', 'src/assets/CyanCardFront.png');
        this.load.image('cyanCardBack', 'src/assets/CyanCardBack.png');
        this.load.image('magentaCardFront', 'src/assets/MagentaCardFront.png');
        this.load.image('magentaCardBack', 'src/assets/MagentaCardBack.png');
    }

    create() {
        this.add.image(600,400,'background');

        let self = this;
        this.isPlayerA = false;
        this.dealer = new Dealer(this);
        this.opponentCards = [];


        this.socket = io('http://localhost:3000');
        this.socket.on('connect', function () {
            console.log('Connected!');
        });

        this.socket.on('isPlayerA', function () {
            self.isPlayerA = true;
        })

        this.socket.on('dealCards', function () {
            self.dealer.dealCards();
            self.dealText.disableInteractive();
        })

        this.socket.on('cardPlayed', function (gameObject, isPlayerA) {
            if (isPlayerA !== self.isPlayerA) {
                let sprite = gameObject.textureKey;
                self.opponentCards.shift().destroy();
                let card = new Card(self);
                console.log(gameObject.y);
                console.log(800-gameObject.y);
                card.render(gameObject.x, 800-gameObject.y, sprite);
                gameObject.input.draggable = false;
            }
        })





        this.dealCards = () => {
            this.dealer = new Dealer(this);
        }

        this.dealText = this.add.text(75, 350, ['DEAL CARDS']).setFontSize(18).setFontFamily('Trebuchet MS').setColor('#00ffff').setInteractive();
        this.dealText.on('pointerdown', function () {
            self.socket.emit("dealCards");
        })
        this.dealText.on('pointerover', function () {
            self.dealText.setColor('#ff69b4');
        })
        this.dealText.on('pointerout', function () {
            self.dealText.setColor('#00ffff');
        })

        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;
        })

         this.input.on('dragend', function (pointer, gameObject) {
            self.socket.emit('cardPlayed', gameObject, self.isPlayerA);
            gameObject.input.draggable = false;
         })
    }

    update() {
    }
}