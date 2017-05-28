const Matter = require('matter-js');

class Speedcap {

  constructor(game, speed, mspeed) {

    this.game = game;
    this.speed = speed;
    this.mspeed = mspeed;
  }

  update(dt, du) {

    const bodies = Matter.Composite.allBodies(this.game.engine.world);
    for (let body of bodies) {
      if (body.thing.type === 'MISSILE') {
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

    delete this.game;
  }

}

module.exports = Speedcap;
