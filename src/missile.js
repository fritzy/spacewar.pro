const Thing = require('./thing');
const Matter = require('matter-js');
const Pixi = require('pixi.js');
const Particle = require('./particle');

const PI2 = Math.PI * 2;
const PI = Math.PI;
const HPI = Math.PI / 2;

class Missile extends Thing {

  constructor(game, ship, target) {

    let texture;
    if (ship.left) {
      texture = game.resources.missile1.texture;
    } else {
      texture = game.resources.missile2.texture;
    }
    const sprite = new Pixi.Sprite(texture);
    sprite.scale.set(1.5);
    sprite.anchor.set(.5);

    let pos = Matter.Vector.clone(ship.body.position);
    pos = Matter.Vector.add(
      pos,
      Matter.Vector.create(
        Math.sin(ship.body.angle) * 24,
        Math.cos(ship.body.angle) * -24
      )
    );
    const body = Matter.Bodies.circle(pos.x, pos.y, 6,
      {
        angle: ship.body.angle,
        frictionAir: 0,
        frictionStatic: 0,
        density: .005,
        isSensor: true
      });
    Matter.Body.setVelocity(body,
      Matter.Vector.add(
        ship.body.velocity,
        Matter.Vector.create(
          Math.sin(ship.body.angle) * 5,
          Math.cos(ship.body.angle) * -5,
        )));

    super(game, body, sprite, 'MISSILE');
    this.game = game;
    this.ship = ship;
    this.target = target;
    this.life = 0;
    this.tsprite = new Pixi.Sprite(texture);
    this.tsprite.anchor.set(.5);
    this.tsprite.scale.set(1);
    this.tsprite.tint = 0xFF0000;
    this.tsprite.renderable = false;
    this.game.stage.addChild(this.tsprite);

    this.game.app.ticker.add(this.update, this);
  }

  update (delta) {

    this.life += this.game.app.ticker.elapsedMS;
    if (this.life > 10000) {
      this.destruct();
      return;
    }
    if (!this.game.settings.mseek) {
      return;
    }
    const mpos = this.body.position;
    let tpos = this.target.body.position;

    this.tsprite.position.set(tpos.x, tpos.y);
    const dist = Math.sqrt(Math.pow(mpos.x - tpos.x, 2) + Math.pow(mpos.y - tpos.y, 2));
    if (this.body.angle > PI) {
      Matter.Body.setAngle(this.body, this.body.angle - PI2);
    } else if (this.body.angle < -PI) {
      Matter.Body.setAngle(this.body, this.body.angle + PI2);
    }
    if (dist < 300) {
      tpos = Matter.Vector.sub(Matter.Vector.add(this.target.body.position, Matter.Vector.mult(this.target.body.velocity, dist / 5)), Matter.Vector.mult(this.body.velocity, dist / 5));
      this.tsprite.position.set(tpos.x, tpos.y);
      let a = Matter.Vector.angle(tpos, mpos);
      
      let diff = a - this.body.angle - HPI;
      if (diff > PI) {
        diff -= PI2;
      } else if (diff < -PI) {
        diff += PI2;
      }

      if (diff > 0) {
        Matter.Body.setAngle(this.body, this.body.angle + .05);
      } else if (diff < 0) {
        Matter.Body.setAngle(this.body, this.body.angle - .05);
      }
      
      if (Math.abs(diff) > 1) {
        return;
      }

      //Matter.Body.setAngle(this.body, (this.body.angle + diff) % PI);
      a = this.body.angle + HPI;
      let v = Matter.Vector.create(Math.cos(a) * -.00013 * delta, Math.sin(a) * -.00013 * delta);
      Matter.Body.applyForce(this.body,
        this.body.position,
        v);
       
      let pvel = Matter.Vector.create(Math.cos(a), Math.sin(a));
      pvel = Matter.Vector.mult(pvel, 1 + Math.random() * 3);
      pvel = Matter.Vector.add(pvel, this.body.velocity);

      new Particle(this.game, Matter.Vector.clone(this.body.position), pvel, 10);
    }

  }

  destruct(quiet) {

    let pos = Matter.Vector.clone(this.body.position);
    let vel = Matter.Vector.clone(this.body.velocity);
    super.destruct();

    if (!quiet) {
      let i = 0;
      do {

        i++;
        let a = Math.random() * PI2 - PI;
        let f = .4 + Math.random() * 2;
        let pvel = Matter.Vector.add(vel, Matter.Vector.create(Math.cos(a) * f, Math.sin(a) * f));
        new Particle(this.game, pos, pvel, 15 + Math.random() * 30);
      } while (i < 30);
    }

    this.tsprite.destroy();
    this.ship.missiles.splice(this.ship.missiles.indexOf(this), 1);
    this.game.app.ticker.remove(this.update, this);
    delete this.target;
    delete this.ship;
    delete this.game;
  }

  collide(other) {

    if (other.type !== 'MISSILE') {
      super.collide(other);
      this.destruct();
    }
  }
}

module.exports = Missile;
