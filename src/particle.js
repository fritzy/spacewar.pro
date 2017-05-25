const Matter = require('matter-js');
const Pixi = require('pixi.js'); 

class Particle {

  constructor(game, pos, vel, life) {

    const av = Math.random();

    this.pos = pos;
    this.vel = vel;
    this.av = av;
    this.game = game;

    this.sprite = new Pixi.Graphics();
    this.sprite.beginFill(0xFFFFFF);
    this.sprite.drawRect(-1.5, -1.5, 3, 3)
    this.game.stage.addChild(this.sprite);
    this.game.particles.push(this);
    this.life = life || 30;
    this.destroyed = false;
    
  }

  update(dt, du) {

    this.life -= du;
    if (this.life < 0) {
      return this.destroy();
    }
    this.sprite.position.set(this.pos.x, this.pos.y);
    this.pos = Matter.Vector.add(this.pos, Matter.Vector.mult(this.vel, du));
  }

  destroy() {

    if (this.destroyed) {
      return;
    }
    this.destroyed = true;
    this.sprite.destroy();
    this.game.particles.splice(this.game.particles.indexOf(this), 1);
    delete this.game;
  }

}

module.exports = Particle;
