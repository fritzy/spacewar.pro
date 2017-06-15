const Matter = require('matter-js');
const Body = Matter.Body;
const Vector = Matter.Vector;

class Player {

  constructor(game, ship, controls) {

    this.ship = ship;
    this.game = game;
    this.controls = controls;
    this.keys = this.game.main.input.keys;
    this.active = {};
    
    this.actions = {
      missile: this.ship.fireMissile.bind(this.ship),
      laser: this.ship.fireBeam.bind(this.ship),
      cloak: this.ship.cloakToggle.bind(this.ship),
      warp: this.ship.warp.bind(this.ship)
    };

  }


  down(event) {

    const action = this.controls[event.key] || this.controls[event.code] || this.controls[event.btn];
    if (this.keys[action]) return;
    if (action) {
      this.active[action] = true;
      if (this.actions[action]) {
        this.actions[action]();
      }
    }
  }

  up(event) {

    const action = this.controls[event.key] || this.controls[event.code] || this.controls[event.btn];
    if (action) {
      delete this.active[action];
    }
  }

  update(dt, du) {

    if (this.active.addshield) {
      this.ship.adjust(1);
    } else if (this.active.addenergy) {
      this.ship.adjust(-1);
    }

    if (this.active.thrust && this.ship.energy >= 1) {
      this.ship.thrust(du);
    }
    if (this.active.left && this.ship.energy >= 1) {
      this.ship.thrustLeft(du);
    }
    if (this.active.right && this.ship.energy >= 1) {
      this.ship.thrustRight(du);
    }
  }

  destruct() {

    delete this.ship;
    delete this.game;
  }

}

module.exports = Player;
