const Matter = require('matter-js');
const Vector = Matter.Vector;
const Body = Matter.Body;
const Pixi = require('pixi.js');
const Drift = require('./ais/drift');
const EvadeMoon = require('./ais/evademoon');
const Charge = require('./ais/charge');
const Corner = require('./ais/corner');

const PI = Math.PI;
const PI2 = Math.PI * 2;
const HPI = Math.PI / 2;

class AI {

  constructor(game, ship, target) {

    this.game = game;
    this.ship = ship;
    this.target = target;
    this.debug = new Pixi.Sprite(this.game.resources.ship1.texture);
    this.debug.tint = this.ship.sprite.tint;
    this.debug.renderable = false;
    this.debug.position.set(100, 100);
    this.game.stage.addChild(this.debug);
    this.state = null;
    this.stateTime = 0;
    this.lastFire = 0;

    this.states = {
      charge: {
        weight: 1,
        klass: Charge,
        maxTime: 7000
      },
      drift: {
        weight: 3,
        klass: Drift,
        maxTime: 4000
      },
      corner: {
        weight: 1,
        klass: Corner,
        maxTime: 2000
      },
      evadeMoon: {
        weight: 0,
        klass: EvadeMoon,
        maxTime: 6000
      }
    }

    this.weights = 0;
    for (let state of Object.keys(this.states)) {
      this.weights += this.states[state].weight;
    }

    this.pickState();
  }

  pickState() {

    let rstate = Math.random() * this.weights;
    for (let state of Object.keys(this.states)) {
      rstate -= this.states[state].weight;
      if (rstate < 0) {
        this.changeState(state);
        break;
      }
    }
  }

  changeState(state, time) {

    if (this.state !== null) {
      this.state.destroy();
      //console.log(`state: ${this.state.name} -> ${state}`);
    } else {
      //console.log(`state: null -> ${state}`);
    }
    this.state = new this.states[state].klass(this, state, this.states[state].maxTime);
    this.stateTime = 0;
  }

  update(dt, du) {

    if (this.ship.destroyed) return;

    if (this.ship.shield > this.ship.energy + 1) {
      this.ship.adjust(-1);
    } else if (this.ship.shield + 1 < this.ship.energy) {
      this.ship.adjust(1);
    }
    const mpos = this.ship.body.position;

    for (let mis of this.target.missiles) {
      const pos = mis.body.position;
      const md = Math.sqrt(Math.pow(mpos.x - pos.x, 2) + Math.pow(mpos.y - pos.y, 2));
      if (md < 65) {
        const a = Vector.angle(mpos, pos);
        let diff = a - this.ship.body.angle + HPI;
        if (diff > PI) {
          diff -= PI2;
        } else if (diff < -PI) {
          diff += PI2;
        }
        if (Math.abs(diff) < 1) {
          this.ship.fireBeam();
        } else {
          //this.ship.warp();
        }
      }
    }

    this.lastFire += dt;
    if (this.state.name !== 'evadeMoon' && this.game.settings.planet) {
      const tpos = this.game.moon.body.position;
      const vpos = Vector.add(mpos, Vector.mult(this.ship.body.velocity, 30));
      this.debug.position.set(vpos.x, vpos.y);
      const pdist = Math.sqrt(Math.pow(tpos.x - vpos.x, 2) + Math.pow(tpos.y - vpos.y, 2));
      if (pdist < 100) {
        this.changeState('evadeMoon');
      }
    }
    this.state.update(dt, du);
    if (this.state.done) {
      this.pickState();
    }
  }
}

module.exports = AI;
