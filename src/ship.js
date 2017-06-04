const Thing = require('./thing');
const Pixi = require('pixi.js');
const Matter = require('matter-js');
const Missile = require('./missile');
const Bargraph = require('./bargraph');
const Beam = require('./beam');
const Particle = require('./particle');
const Body = Matter.Body;
const Vector = Matter.Vector;

const PI2 = Math.PI * 2;
const PI = Math.PI;
const HPI = Math.PI / 2;
const Tween = require('tween.js');


class Ship extends Thing {

  constructor(game, img, x, y, left) {

    const sprite = new Pixi.Sprite(game.resources[img].texture);
    const body = Matter.Bodies.circle(x, y, 12, {
      frictionAir: 0,
      frictionStatic: 0,
      density: .01,
    });
    sprite.anchor.set(.5);
    sprite.scale.set(1.5);

    super(game, body, sprite, 'SHIP');
    this.game = game;

    this.shield = 30;
    this.cloaking = false;
    this.warping = false;
    this.warpTime = 0;
    this.cloakTime = 0;
    this.energy = 30;
    this.shieldIcon = new Pixi.Sprite.fromFrame('kosov-s');
    this.shieldIcon.position.set(left ? 5 : this.game.width - 115, 6);
    this.shieldGraph = new Bargraph(game, left ? 20 : this.game.width - 100, 5)
    this.shieldGraph.draw(this.shield);

    this.energyIcon = new Pixi.Sprite.fromFrame('kosov-e');
    this.energyIcon.position.set(left ? 4 : this.game.width - 116, 25);
    this.energyGraph = new Bargraph(game, left ? 20 : this.game.width - 100, 26)
    this.energyGraph.draw(this.energy);
    this.missiles = [];
    this.lastEnergyBump = 0;
    this.game.stage.addChild(this.energyIcon);
    this.game.stage.addChild(this.shieldIcon);
    this.beam = null;
    this.left = left;
    if (this.left) {
      this.sprite.tint = this.game.settings.scolors[0];
    } else {
      this.sprite.tint = this.game.settings.scolors[1];
    }
    this.color = this.sprite.tint;

  }

  update(dt, du) {

    super.update(dt, du);
    if (this.destroyed) return;

    this.lastEnergyBump += dt;
    if (this.lastEnergyBump >= 1000) {
      this.lastEnergyBump = 0;
      if (this.energy < 30) {
        this.energy += 1;
        this.energyGraph.draw(this.energy);
      } else if (this.shield < 30) {
        this.shield += 1;
        this.shieldGraph.draw(this.shield);
      }
    }
    if (this.cloaking) {
      if (this.energy < 1) {
        this.unCloak();
      } else {
        this.cloakTime += dt;
        if (this.cloakTime >= 500) {
          this.cloakTime = 0;
          this.useEnergy(1);
        }
      }
    }
    for (let i = this.missiles.length - 1; i >= 0; i--) {
      this.missiles[i].update(dt, du);
    }
    if (this.beam !== null) {
        this.beam.update(dt, du);
    }
  }

  cloakToggle() {

    if (!this.cloaking) {
      if (this.energy < 4) return;
      this.cloaking = true;
      this.cloakTime = 0;
      this.sprite.tint = 0x000000;
      this.useEnergy(4);
    } else {
      this.unCloak();
    }
  }

  unCloak() {

    this.cloaking = false;
    this.sprite.tint = this.color;
  }

  thrust(du) {

    Body.applyForce(
      this.body, this.body.position,
      Vector.create(
        Math.sin(this.body.angle) * du * .0006,
        Math.cos(this.body.angle) * du * -.0006
      )
    );
  }

  thrustLeft(du) {

    if (!this.warping) {
      Body.rotate(this.body, -.075 * du);
      Body.setAngularVelocity(this.body, 0);
    }
  }

  thrustRight(du) {

    if (!this.warping) {
      Body.rotate(this.body, .075 * du);
      Body.setAngularVelocity(this.body, 0);
    }
  }

  warp() {

    if (this.warping || this.energy < 2) return;
    this.useEnergy(2);
    Matter.World.remove(this.game.engine.world, [this.body]);
    this.warping = true;
    //this.sprite.scale.set(1.5, 14);
    this.sprite.anchor.set(.5, 0);
    Matter.Body.setVelocity(this.body, Matter.Vector.create(0, 0));
    Matter.Body.setAngularVelocity(this.body, 0);
    let pos1 = Matter.Vector.clone(this.body.position);
    pos1 = Matter.Vector.add(
      pos1,
      Matter.Vector.create(
        Math.sin(this.body.angle) * 100,
        Math.cos(this.body.angle) * -100
      )
    );
    let pos2 = Matter.Vector.clone(this.body.position);
    pos2 = Matter.Vector.add(
      pos2,
      Matter.Vector.create(
        Math.sin(this.body.angle) * 200,
        Math.cos(this.body.angle) * -200
      )
    );
    const ship = this;
    const anim = new Tween.Tween({x: ship.body.position.x, y: ship.body.position.y, s: 0})
      .to({x: pos2.x, y: pos2.y, s: 100}, 200)
      .easing(Tween.Easing.Quadratic.Out)
      .onUpdate(function () {
        Matter.Body.setPosition(ship.body, Matter.Vector.create(this.x, this.y));
      })
      .onComplete(function () {
      })
      .start();
    const scale = new Tween.Tween({s: .5})
      .to({s: 12.4}, 200)
      .easing(Tween.Easing.Quadratic.Out)
      .onUpdate(function () {
        ship.sprite.scale.set(1.5, this.s);
      })
      .onComplete(function () {
      });
    const scale2 = new Tween.Tween({s: 12.4, z: 0})
      .to({s: 1.5, z: .5}, 125)
      .easing(Tween.Easing.Quadratic.Out)
      .onUpdate(function () {
        ship.sprite.scale.set(1.5, this.s);
        ship.sprite.anchor.set(.5, this.z);
      })
      .onComplete(function () {
        ship.sprite.anchor.set(.5, .5);
        Matter.World.add(ship.game.engine.world, [ship.body]);
        ship.warping = false;
      });
    scale.chain(scale2);
    scale.start();
  }

  fireMissile() {

    if (this.energy < 3) return;
    if (this.missiles.length < 5) {
      this.missiles.push(new Missile(this.game, this, this.other));
      this.useEnergy(3);
    }
  }

  fireBeam() {

    if (this.energy < 2)
      return;
    if (this.beam === null || this.beam.destroyed) {
      this.beam = new Beam(this.game, this);
      this.useEnergy(2);
    }
  }

  destruct(boom) {

    if (boom) {
      let i = 0;
      let pos = Matter.Vector.clone(this.body.position);
      let vel = Matter.Vector.clone(this.body.velocity);
      do {
        i++;
        let a = Math.random() * PI2 - PI;
        let f = .4 + Math.random() * 4;
        let pvel = Matter.Vector.add(vel, Matter.Vector.create(Math.cos(a) * f, Math.sin(a) * f));
        new Particle(this.game, pos, pvel, 20 + Math.random() * 50, this.color);
      } while (i < 100);
      this.game.end();
    }

    if (this.beam) {
      this.beam.destruct();
    }

    for (let i = this.missiles.length - 1; i >= 0; --i) {
      this.missiles[i].destruct();
    }

    super.destruct();
    this.missiles = [];;

  }

  adjust(dir) {

    if (dir === -1 && this.energy < 30 && this.shield > 1) {
      this.shield -= 1;
      this.energy += 1;
    } else if (dir === 1 && this.shield < 30 && this.energy > 1){
      this.energy -= 1;
      this.shield += 1;
    }
    this.energyGraph.draw(this.energy);
    this.shieldGraph.draw(this.shield);
  }

  useEnergy(amt) {

    this.energy -= amt;
    this.energyGraph.draw(this.energy);
  }

  damage(dmg) {
    this.shield -= dmg;
    if (this.shield <= 0) {
      this.shield = 0;
      this.destruct(true);
    }
    this.shieldGraph.draw(this.shield);
  }

  collide(other) {

    if (other.type === 'MISSILE') {
      this.damage(4);
    } else if (other.type === 'MOON') {
      this.destruct(true)
    }
  }
}

module.exports = Ship;
