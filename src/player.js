const Matter = require('matter-js');
const Body = Matter.Body;
const Vector = Matter.Vector;

class Player {

  constructor(game, ship, controls) {

    this.ship = ship;
    this.game = game;
    this.keys = {};
    this.controls = controls;
    this.held = {};

    this.down = (e) => {

      if (this.keys[e.key]) {
        return false;
      }
      const action = this.controls[e.key] || this.controls[e.code];
      if (action) {
        this.keys[action] = true;
        this.held[action] = 0;
        if (action === 'missile' && this.ship.energy >= 2) {
          this.ship.fireMissile();
        }
        if (action === 'laser' && this.ship.energy >= 4) {
          this.ship.fireBeam();
        }
      }
    }

    this.up = (e) => {


      const action = this.controls[e.key] || this.controls[e.code];
      if (action) {
        delete this.keys[action];
      }
    };


    window.addEventListener('keydown', this.down, true);
    window.addEventListener('keyup', this.up, true);

  }

  update(dt, du) {

    const body = this.ship.body;

    for (let key of Object.keys(this.keys)) {
      this.held[key] += dt;
    }

    if (this.keys.addshield) {
      this.ship.adjust(1);
    } else if (this.keys.addenergy) {
      this.ship.adjust(-1);
    }


    if (this.keys.thrust && this.ship.energy >= 1) {
      if (this.held.thrust > 1000) {
        this.held.thrust = 0;
        //this.ship.useEnergy(1);
      }
      Body.applyForce(
        this.ship.body, body.position,
        Vector.create(
          Math.sin(body.angle) * du * .0003,
          Math.cos(body.angle) * du * -.0003
        )
      );
    }
    if (this.keys.left && this.ship.energy >= 1) {
      Body.rotate(body, -.05);
      Body.setAngularVelocity(body, 0);
    }
    if (this.keys.right && this.ship.energy >= 1) {
      Body.setAngularVelocity(body, 0);
      Body.rotate(body, .05);
    }
  }

  destruct() {

    window.removeEventListener('keydown', this.down, true);
    window.removeEventListener('keyup', this.up, true);
    delete this.ship;
    delete this.game;
  }

}

module.exports = Player;
