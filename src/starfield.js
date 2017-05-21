const Pixi = require('pixi.js');

class Starfield {

    constructor(game) {

        this.game = game;
        this.stars = new Pixi.Graphics();
        this.game.stage.addChild(this.stars);
        this.stars.lineStyle(1, 0xFFFFFF);

        for (let i = 0; i < 150; i++) {
            const x = Math.random() * this.game.width;
            const y = Math.random() * this.game.height;
            this.stars.beginFill(0xFFFFFF);
            this.stars.drawRect(x, y, 2, 2);
            this.stars.endFill();
        }
    }
}

module.exports = Starfield;
