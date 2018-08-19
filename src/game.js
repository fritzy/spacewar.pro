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
const Tween = require('tween.js');

class Game extends Scene {

  constructor(main, settings, left, right) {

    super(main);
    this.sounds = this.main.sounds;
    this.settings = settings;
    this.engine = Matter.Engine.create();
    this.engine.world.gravity.y = 0;
    this.ended = false;
    this.endTime = 0;
    this.particles = [];

    this.instructions = new PIXI.Text("USE W,A,S,D For Controls\nScroll Down to See More", {
      fontFamily : 'Monospace',
      fontSize: 30,
      fill : 0xFFFFFF,
      fontWeight: 'bold',
      align : 'center'}
    );
    this.instructions.position.set(-this.instructions.width / 2, 400);
    this.instructions.anchor.set(.5);
    this.stage.addChild(this.instructions);


    Matter.Events.on(this.engine, 'collisionStart', (ev) => {

      for (let col of ev.pairs) {
        col.bodyA.thing.collide(col.bodyB.thing, col.contacts);
        col.bodyB.thing.collide(col.bodyA.thing, col.contacts);
      }
    });

    this.left = left || {
      w: 'thrust',
      a: 'left',
      d: 'right',
      s: 'missile',
      q: 'addshield',
      e: 'addenergy',
      c: 'laser',
      x: 'cloak',
      z: 'warp',
      '0.14': 'left',
      '0.15': 'right',
      '0.12': 'thrust',
      '0.2': 'missile',
      '0.4': 'addshield',
      '0.5': 'addenergy',
      '0.0': 'laser',
      '0.3': 'warp',
      '0.1': 'cloak',
      '1.14': 'left',
      '1.15': 'right',
      '1.12': 'thrust',
      '1.2': 'missile',
      '1.4': 'addshield',
      '1.5': 'addenergy',
      '1.0': 'laser',
      '1.3': 'warp',
      '1.1': 'cloak',
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
    };
    this.right = right || left;

  }

  start() {

    this.starField = new Starfield(this);
    this.ship = new Ship(this, 'ship1', 100, this.height / 2, true);
    this.ship2 = new Ship(this, 'ship2', this.width - 100, this.height / 2);

    if (this.settings.aileft) {
      this.ai = new AI(this, this.ship, this.ship2);
    } else {
      this.player = new Player(this, this.ship, this.left);
    }
    if (this.settings.airight) {
      this.ai2 = new AI(this, this.ship2, this.ship);
    } else {
      this.player2 = new Player(this, this.ship2, this.right);
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

    if (this.player) {
      this.player.up(event, keys);
    }
    if (this.player2) {
      this.player2.up(event, keys);
    }
  }

  down(event, keys) {

    if (event.code && event.code.substr(0, 5) === 'Arrow' && Tween.getAll().length === 0) {
      const pos = { x: this.instructions.width / -2 };
      const slideIn = new Tween.Tween(pos)
      .to({ x: this.instructions.width / 2 + 20 }, 500)
      .onUpdate(() => {
        this.instructions.position.x = pos.x;
      })
      .easing(Tween.Easing.Quadratic.In);
      const slideBack = new Tween.Tween(pos)
      .to({ x: this.instructions.width  / -2 }, 500)
      .delay(3000)
      .onUpdate(() => {
        this.instructions.position.x = pos.x;
      })
      .easing(Tween.Easing.Quadratic.In);
      slideIn.chain(slideBack);
      slideIn.start();
      event.preventDefault();

      return;
    }
    if (this.player) {
      this.player.down(event, keys);
    }
    if (this.player2) {
      this.player2.down(event, keys);
    }
  }

  update(dt, du) {

    if (this.player) {
      this.player.update(dt, du);
    }
    if (this.player2) {
      this.player2.update(dt, du);
    }
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
      dt
    );
  }

  destroy() {

    Tween.removeAll();
    if (this.player) {
      this.player.destruct();
    }

    if (this.player2) {
      this.player2.destruct();
    }
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
