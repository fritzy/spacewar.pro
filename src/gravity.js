const Matter = require('matter-js');

class Gravity {

  constructor(game) {

    this.game = game;
    this.game.app.ticker.add(this.update, this);
    this.hw = this.game.width / 2;
    this.hh = this.game.height / 2;
  }
  
  update(delta) {

    const bodies = Matter.Composite.allBodies(this.game.engine.world);
    for (let body of bodies) {
      let a = Math.atan2(body.position.y - this.hh, body.position.x - this.hw);
      let v = Matter.Vector.create(Math.cos(a) * -.0001 * delta, Math.sin(a) * -.0001 * delta);
      Matter.Body.applyForce(body,
        body.position,
        v);
    }
  }

  destruct () {

    this.game.app.ticker.remove(this.update, this);
  }

}

module.exports = Gravity;
