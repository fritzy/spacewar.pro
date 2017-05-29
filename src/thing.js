const Matter = require('matter-js');

class Thing {

  constructor(game, body, sprite, type) {

    this.game = game;
    this.body = body;
    this.type = type || 'THING';
    this.destroyed = false;

    this.body.thing = this;
    this.sprite = sprite;

    this.game.stage.addChild(this.sprite);
    Matter.World.add(this.game.engine.world, [body]);

  }
   
  update() {

    if (this.destroyed) {
      return;
    }
    if (this.body.position.x > this.game.width) {
      Matter.Body.setPosition(this.body, Matter.Vector.create(this.body.position.x - this.game.width, this.body.position.y));
    } else if (this.body.position.x < 0) {
      Matter.Body.setPosition(this.body, Matter.Vector.create(this.game.width + this.body.position.x, this.body.position.y));
    }
    if (this.body.position.y > this.game.height) {
      Matter.Body.setPosition(this.body, Matter.Vector.create(this.body.position.x, this.body.position.y - this.game.height));
    } else if (this.body.position.y < 0) {
      Matter.Body.setPosition(this.body, Matter.Vector.create(this.body.position.x, this.game.height + this.body.position.y));
    }
    this.sprite.position.set(this.body.position.x, this.body.position.y);
    this.sprite.rotation = this.body.angle;
  }

  destruct() {

    Matter.World.remove(this.game.engine.world, [this.body]);
    this.game.stage.removeChild(this.sprite);
    this.destroyed = true;
  }

  damage() {
  }
  
  collide(other) {
  }
}

module.exports = Thing;
