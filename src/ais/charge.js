const Matter = require('matter-js');
const AIState = require('./aistate');

const Vector = Matter.Vector;
const HPI = Math.PI / 2;
const PI = Math.PI;
const PI2 = Math.PI * 2;

class Charge extends AIState {

  update(dt, du) {

    super.update(dt, du);
    const mpos = this.ship.body.position;
    const tbody = this.target.body;
    const sbody = this.ship.body;
    let tpos = tbody.position;

    const dist = Math.sqrt(Math.pow(mpos.x - tpos.x, 2) + Math.pow(mpos.y - tpos.y, 2));
    tpos = Vector.sub(Vector.add(tpos, Vector.mult(tbody.velocity, dist / 5)), Vector.mult(sbody.velocity, dist / 5));

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

    if (dist < 80 && Math.abs(diff) < 1) {
      this.ship.fireBeam();
      this.done = true;
      return;
    }

    if (Math.abs(diff) > 1 || dist < 50) return;

    this.ship.thrust(du);
  }
}

module.exports = Charge;
