const Scene = require('./scene');
const Pixi = require('pixi.js');
const Player = require('./player');
const Ship = require('./ship');
const Starfield = require('./starfield');
const Gravity = require('./gravity');
const Speedcap = require('./speedcap');
const Matter = require('matter-js');
const Moon = require('./moon');
const AI = require('./ai');

class Game extends Scene {

  constructor(main, settings) {

    super(main);
    this.sounds = this.main.sounds;
    this.settings = settings;
    this.engine = Matter.Engine.create();
    this.engine.world.gravity.y = 0;
    this.ended = false;
    this.endTime = 0;
    this.particles = [];
    Matter.Events.on(this.engine, 'collisionStart', (ev) => {

      for (let col of ev.pairs) {
        col.bodyA.thing.collide(col.bodyB.thing, col.contacts);
        col.bodyB.thing.collide(col.bodyA.thing, col.contacts);
      }
    });
  }

  start() {

    this.starField = new Starfield(this);
    this.ship = new Ship(this, 'ship1', 100, this.height / 2, true);
    this.player = new Player(this, this.ship,
      {
        w: 'thrust',
        a: 'left',
        d: 'right',
        s: 'missile',
        q: 'addshield',
        e: 'addenergy',
        c: 'laser',
        x: 'cloak',
        z: 'warp'
      });
    this.ship2 = new Ship(this, 'ship2', this.width - 100, this.height / 2);
    this.player2 = new Player(this, this.ship2,
      {
        i: 'thrust',
        j: 'left',
        l: 'right',
        k: 'missile',
        u: 'addshield',
        o: 'addenergy',
        m: 'laser',
        ',': 'cloak',
        '.': 'warp',
        Numpad7: 'addshield',
        Numpad8: 'thrust',
        Numpad9: 'addenergy',
        Numpad4: 'left',
        Numpad5: 'missile',
        Numpad6: 'right',
        Numpad1: 'laser',
        Numpad2: 'cloak',
        Numpad3: 'warp'
      });

    if (this.settings.aileft) {
      this.ai = new AI(this, this.ship, this.ship2);
    }
    if (this.settings.airight) {
      this.ai2 = new AI(this, this.ship2, this.ship);
    }

    this.ship.other = this.ship2;
    this.ship2.other = this.ship;
    const hw = this.width / 2;
    const hh = this.height / 2;

    if (this.settings.gravity) {
      this.gravity = new Gravity(this);
    }
    if (this.settings.planet) {
      this.moon = new Moon(this);
    }
    this.speedcap = new Speedcap(this, 5, 8);
  }

  end(s) {
    if (!this.ended) {
      if (s === 0) {
        this.main.rightScore += 1;
      } else {
        this.main.leftScore += 1;
      }
    }
    this.ended = true;
  }

  up(event, keys) {

    this.player.up(event, keys);
    this.player2.up(event, keys);
  }

  down(event, keys) {

    this.player.down(event, keys);
    this.player2.down(event, keys);
  }

  update(dt, du) {

    this.player.update(dt, du);
    this.player2.update(dt, du);
    this.ship.update(dt, du);
    this.ship2.update(dt, du);
    for (let i = this.particles.length - 1; i >= 0; --i) {
      this.particles[i].update(dt, du);
    }
    if (this.settings.gravity) {
      this.gravity.update(dt, du);
    }
    this.speedcap.update(dt, du);
    if (this.settings.aileft) {
      this.ai.update(dt, du);
    }
    if (this.settings.airight) {
      this.ai2.update(dt, du);
    }
    if (this.ended) {
      this.endTime += dt;
      if (this.endTime >= 4000) {
        this.main.startMenu();
      }
    }

    Matter.Engine.update(
      this.engine,
      //this.app.ticker.elapsedMS
      dt
    );
  }

  destroy() {

    this.player.destruct();
    this.player2.destruct();
    for (let particle of this.particles) {
      particle.destroy();
    }
    this.ship.destruct(false);
    this.ship2.destruct(false);
    if (this.settings.gravity) {
      this.gravity.destruct();
    }
    if (this.settings.planet) {
      this.moon.destruct();
    }
    this.speedcap.destruct();

    delete this.starfield;
    super.destroy();
    Matter.Engine.clear(this.engine);
    delete this.player;
    delete this.player2;
    delete this.ship;
    delete this.ship2;
    delete this.gravity;
  }

}

module.exports = Game;
