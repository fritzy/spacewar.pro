const AIState = require('./aistate');
const PI = Math.PI;
const PI2 = Math.PI * 2;
const HPI = Math.PI / 2;
const Matter = require('matter-js');
const Vector = Matter.Vector;

class Drift extends AIState {

  update(dt, du) {

    super.update(dt, du);
    const mpos = this.ship.body.position;
    const tbody = this.target.body;
    const sbody = this.ship.body;
    let tpos = tbody.position;

    const dist = Math.sqrt(Math.pow(mpos.x - tpos.x, 2) + Math.pow(mpos.y - tpos.y, 2));
    if (dist < 60) {
      this.done = true;
      this.ai.changeState('corner');
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
      this.ship.thrustRight(du);
    } else if (diff < 0) {
      this.ship.thrustLeft(du);
    }

    if (Math.abs(diff) < 1 && this.ai.lastFire > 300) {
      const a = sbody.angle - HPI;
      const eray = Vector.add(sbody.position, Vector.create(Math.cos(a) * 400, Math.sin(a) * 400));
      this.ai.debug.position.set(eray.x, eray.y);
      if (!this.game.moon ||
        Matter.Query.ray([this.game.moon.body],
        sbody.position,
        eray,
        16
      ).length == 0) {
        this.ai.lastFire = 0;
        this.ship.fireMissile();
      } else {
        this.done = true;
      }
    }
  }
}

module.exports = Drift;
