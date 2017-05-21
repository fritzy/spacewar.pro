const Matter = require('matter-js');

class Speedcap {

  constructor(game, speed, mspeed) {

    this.game = game;
    this.speed = speed;
    this.mspeed = mspeed;
    this.game.app.ticker.add(this.update, this);
  }

  update(delta) {

    const bodies = Matter.Composite.allBodies(this.game.engine.world);
    for (let body of bodies) {
      if (body.type === 'MISSILE') {
        if (body.speed > this.mspeed) {
          Matter.Body.setVelocity(body, Matter.Vector.mult(body.velocity, .95));
        }
      } else {
        if (body.speed > this.speed) {
          Matter.Body.setVelocity(body, Matter.Vector.mult(body.velocity, .95));
        }
      }
    }
  }

  destruct () {

    this.game.app.ticker.remove(this.update, this);
    delete this.game;
  }

}

module.exports = Speedcap;
