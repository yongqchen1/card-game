export default class Card {
    constructor(scene) {
        this.render = (x, y, sprite) => {
            let card = scene.add.image(x, y, sprite).setScale(0.2, 0.2).setInteractive();
            scene.input.setDraggable(card);
            card.on('pointerover',function(){
                card.setScale(1, 1);
            })
            card.on('pointerout',function(){
                card.setScale(0.2, 0.2);
            })
            return card;
        }
    }
}