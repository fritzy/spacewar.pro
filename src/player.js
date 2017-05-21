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
      this.keys[e.key] = true;
      this.held[e.key] = 0;
      if (e.key === this.controls.missile && this.ship.energy >= 2) {
        this.ship.fireMissile();
      }
      if (e.key === this.controls.laser && this.ship.energy >= 4) {
        this.ship.fireBeam();
      }
    }

    this.up = (e) => {

      delete this.keys[e.key];
    };


    window.addEventListener('keydown', this.down, true);
    window.addEventListener('keyup', this.up, true);

    this.game.app.ticker.add(this.update, this);
  }
 
  keyDown(e) {

  }

  keyUp(e) {

    console.log(this.keys);
  }

  update() {

    const dt = this.game.app.ticker.elapsedMS;
    const body = this.ship.body;

    for (let key of Object.keys(this.keys)) {
      this.held[key] += dt;
    }

    if (this.keys[this.controls.addshield]) {
      this.ship.adjust(1);
    } else if (this.keys[this.controls.addenergy]) {
      this.ship.adjust(-1);
    }


    if (this.keys[this.controls.thrust] && this.ship.energy >= 1) {
      if (this.held[this.controls.thrust] > 1000) {
        this.held[this.controls.thrust] = 0;
        //this.ship.useEnergy(1);
      }
      Body.applyForce(
        this.ship.body,
        body.position,
        Vector.create(
          Math.sin(body.angle) * dt * .00003,
          Math.cos(body.angle) * dt * -.00003
        )
      );
    }
    if (this.keys[this.controls.left] && this.ship.energy >= 1) {
      Body.rotate(body, -.05);
      Body.setAngularVelocity(body, 0);
    }
    if (this.keys[this.controls.right] && this.ship.energy >= 1) {
      Body.setAngularVelocity(body, 0);
      Body.rotate(body, .05);
    }
  }

  destruct() {

    console.log('clear player');
    window.removeEventListener('keydown', this.down, true);
    window.removeEventListener('keyup', this.up, true);
    this.game.app.ticker.remove(this.update, this);
    delete this.ship;
    delete this.game;
  }

}

module.exports = Player;
