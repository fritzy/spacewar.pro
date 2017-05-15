const Pixi = require('pixi.js');

class Bargraph {

    constructor(game, x, y) {

        this.sprite = new Pixi.Graphics();
        this.sprite.position.set(x, y);
        this.game = game;
        this.game.app.stage.addChild(this.sprite);
    }

    draw(width) {

        width *= 3;
        this.sprite.clear();
        this.sprite.beginFill(0xFFFFFF);
        this.sprite.drawRect(0, 0, width, 16);
    }
}

module.exports = Bargraph;
