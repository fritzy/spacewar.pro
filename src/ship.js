const Thing = require('./thing');
const Pixi = require('pixi.js');
const Matter = require('matter-js');
const Missile = require('./missile');
const Bargraph = require('./bargraph');
const Beam = require('./beam');
const Particle = require('./particle');

const PI2 = Math.PI * 2;
const PI = Math.PI;
const HPI = Math.PI / 2;

class Ship extends Thing {

  constructor(game, img, x, y, left) {

    const sprite = new Pixi.Sprite(game.resources[img].texture);
    const body = Matter.Bodies.circle(x, y, 12, {
      frictionAir: 0,
      frictionStatic: 0,
      density: .005
    });
    sprite.anchor.set(.5);
    sprite.scale.set(1.5);

    super(game, body, sprite, 'SHIP');
    this.game = game;

    this.shield = 30;
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

    super.update();
    if (this.destroyed) {
      return;
    }
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
    for (let i = this.missiles.length - 1; i >= 0; i--) {
      this.missiles[i].update(dt, du);
    }
    if (this.beam !== null) {
        this.beam.update(dt, du);
    }
  }

  thrust() {
  }
  
  fireMissile() {
    
    if (this.missiles.length < 8) {
      this.missiles.push(new Missile(this.game, this, this.other));
      this.useEnergy(2);
    }
  }

  fireBeam() {
    
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

    for (let missile of this.missiles) {
      missile.destruct(true);
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
