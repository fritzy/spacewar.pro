const Thing = require('./thing');
const Pixi = require('pixi.js');
const Matter = require('matter-js');

class Moon {

  constructor(game) {

    this.game = game;
    const sprite = new Pixi.Sprite(this.game.resources.moon.texture);
    sprite.anchor.set(.5);
    sprite.position.set(this.game.width / 2, this.game.height / 2);

    const body = Matter.Bodies.circle(this.game.width / 2,this.game.height / 2, 32, {
      isStatic: true
    });

    this.body = body;
    this.body.thing = this;
    this.sprite = sprite;
    this.type = 'MOON';

    Matter.World.add(this.game.engine.world, [body]);
    this.game.stage.addChild(this.sprite);

  }

  destruct() {

    Matter.World.remove(this.game.engine.world, [this.body]);
    this.game.stage.removeChild(this.sprite);
  }

  collide(other) {
  }
      
}

module.exports = Moon;
