const Matter = require('matter-js');
const AIState = require('./aistate');

const Vector = Matter.Vector;
const HPI = Math.PI / 2;
const PI = Math.PI;
const PI2 = Math.PI * 2;

class Corner extends AIState {

  constructor(ai, name, time) {

    super(ai, name, time);
    let x, y;
    x = Math.random() < .5 ? 100 : this.ai.game.width - 100;
    y = Math.random() < .5 ? 100 : this.ai.game.height - 100;
    this.target = Vector.create(x, y);
  }

  update(dt, du) {

    super.update(dt, du);
    const mpos = this.ship.body.position;
    const sbody = this.ship.body;
    let tpos = this.target;

    const dist = Math.sqrt(Math.pow(mpos.x - tpos.x, 2) + Math.pow(mpos.y - tpos.y, 2));
    this.ai.debug.position.set(tpos.x, tpos.y);

    let a = Vector.angle(tpos, mpos);

    let diff = a - sbody.angle - HPI;
    if (diff > PI) {
      diff -= PI2;
    } else if (diff < -PI) {
      diff += PI2;
    }

    if (diff > 0) {
      this.ship.thrustRight(du);
    } else if (diff < 0) {
      this.ship.thrustLeft(du);
    }

    if (dist < 80) {
      this.done = true;
      return;
    }

    if (Math.abs(diff) > 1 || dist < 50 || Math.abs(sbody.velocity.x) > 6 || Math.abs(sbody.velocity.y) > 6) return;

    this.ship.thrust(du);
  }
}

module.exports = Corner;
