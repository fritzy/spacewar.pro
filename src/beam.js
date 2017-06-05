const Thing = require('./thing');
const Matter = require('matter-js');
const Pixi = require('pixi.js');
const Particle = require('./particle');

const PI2 = Math.PI * 2;
const PI = Math.PI;

class Beam extends Thing {

  constructor(game, ship) {

    const sprite = new Pixi.Graphics();
    sprite.lineStyle(2, ship.color);
    sprite.arc(0, 0, 16, -Math.PI, 0);


    let pos = Matter.Vector.clone(ship.body.position);
    const body = Matter.Bodies.circle(pos.x, pos.y, 7,
      {
        angle: ship.body.angle,
        frictionAir: 0,
        frictionStatic: 0,
        isSensor: true
      });
    Matter.Body.setVelocity(body,
      Matter.Vector.add(
        ship.body.velocity,
        Matter.Vector.create(
          Math.sin(ship.body.angle) * 5,
          Math.cos(ship.body.angle) * -5,
        )));

    super(game, body, sprite, 'BEAM');
    this.game = game;
    this.ship = ship;
    this.body = body;
    this.sprite = sprite;
    this.color = this.ship.color;
    Matter.Body.scale(this.body, 2, 2);
    this.life = 0;
  }

  update(dt, du) {

    super.update(dt, du);
    this.sprite.scale.set(this.sprite.scale.x + .003 * dt);
    Matter.Body.scale(this.body, 1 + (.003 * dt / 2), 1 + (.003 * dt / 2));
    this.life += dt;
    if (this.life > 300) {
      this.destruct();
    }
  }

  destruct() {

    super.destruct();
    this.ship.beam = null;
  }

  collide(other, contacts) {

    super.collide(other);
    if (other.type === 'SHIP' && other !== this.ship) {
      const colors = [this.ship.color, other.color];
      const pos = contacts[Object.keys(contacts)[0]].vertex;
      let i = 0;
      do {
        i++;
        const a = Math.random() * PI2 - PI;
        const f = .4 + Math.random() * 2;
        const pvel = Matter.Vector.create(Math.cos(a) * f, Math.sin(a) * f);
        new Particle(this.game, pos, pvel, 15 + Math.random() * 30, colors);
      } while (i < 30);
      this.game.sounds.beamhit.play();
      other.damage(4);
      this.destruct();
    } else if (other.type === 'MISSILE') {
      this.game.sounds.beamhit.play();
      other.destruct();
      other.blowUp([this.color, other.color]);
    }
  }
}

module.exports = Beam;
