const Matter = require('matter-js');
const Vector = Matter.Vector;
const AIState = require('./aistate');

const PI = Math.PI;
const PI2 = Math.PI * 2;
const HPI = Math.PI / 2;

class EvadeMoon extends AIState {

  constructor(ai, name, time) {
    super(ai, name, time);
  }

  update(dt, du) {

    super.update(dt, du);
    const mpos = this.ship.body.position;
    const tbody = this.game.moon.body;
    const sbody = this.ship.body;
    let tpos = tbody.position;


    const vpos = Vector.add(mpos, Vector.mult(this.ship.body.velocity, 30));
    //this.ai.debug.position.set(vpos.x, vpos.y);
    const pdist = Math.sqrt(Math.pow(tpos.x - vpos.x, 2) + Math.pow(tpos.y - vpos.y, 2));
    const mdist = Math.sqrt(Math.pow(tpos.x - mpos.x, 2) + Math.pow(tpos.y - mpos.y, 2));
    if (mdist < 75) {
      this.ship.warp();
      this.done = true;
      return;
    }
    if (pdist > 100) {
      this.done = true;
      return;
    }

    let a = Vector.angle(tpos, mpos);

    let diff = a - sbody.angle - HPI;
    if (diff > PI) {
      diff -= PI2;
    } else if (diff < -PI) {
      diff += PI2;
    }

    if (diff > 0) {
      this.ship.thrustLeft(du);
    } else if (diff < 0) {
      this.ship.thrustRight(du);
    }

    if (Math.abs(diff) > .5) {
      this.ai.ship.thrust(du);
    }
  }
}

module.exports = EvadeMoon;
