const Scene = require('./scene');
const Pixi = require('pixi.js');
const Player = require('./player');
const Ship = require('./ship');
const Starfield = require('./starfield');
const Gravity = require('./gravity');
const Speedcap = require('./speedcap');
const Matter = require('matter-js');
const Moon = require('./moon');

class Game extends Scene {

  constructor(main, settings) {

    super(main);
    this.settings = settings;
    this.engine = Matter.Engine.create();
    this.engine.world.gravity.y = 0;
    this.particles = [];
    Matter.Events.on(this.engine, 'collisionStart', (e) => {

      for (let col of e.pairs) {
        col.bodyA.thing.collide(col.bodyB.thing);
        col.bodyB.thing.collide(col.bodyA.thing);
      }
    });
  }

  start() {

    this.starField = new Starfield(this);

    const kosove = new Pixi.Texture(this.resources.kosov.texture.baseTexture);
    kosove.frame = new Pixi.Rectangle(60,0,15,14);
    Pixi.Texture.addToCache(kosove, `kosov-e`);
    const kosovs = new Pixi.Texture(this.resources.kosov.texture.baseTexture);
    kosovs.frame = new Pixi.Rectangle(46,46,15,14);
    Pixi.Texture.addToCache(kosovs, `kosov-s`);

    this.ship = new Ship(this, 'ship1', 100, this.height / 2, true);
    this.player = new Player(this, this.ship,
      {
        thrust: 'w',
        left: 'a',
        right: 'd',
        missile: 's',
        addshield: 'q',
        addenergy: 'e',
        laser: 'c'
      });
    this.ship2 = new Ship(this, 'ship2', this.width - 100, this.height / 2);
    this.player2 = new Player(this, this.ship2,
      {
        thrust: 'i',
        left: 'j',
        right: 'l',
        missile: 'k',
        addshield: 'u',
        addenergy: 'o',
        laser: 'm'
      });


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
    this.speedcap = new Speedcap(this, 6, 8);
    this.app.ticker.add(this.update, this);
  }

  end() {
    setTimeout(() => {
      this.main.startMenu();
    }, 4000);
  }

  update() {
    Matter.Engine.update(
      this.engine,
      //this.app.ticker.elapsedMS
      1000/60
    );
  }

  destroy() {

    this.player.destruct();
    this.player2.destruct();
    console.log(1)
    for (let particle of this.particles) {
      particle.destroy();
    }
    console.log(2)
    this.ship.destruct(false);
    this.ship2.destruct(false);
    if (this.settings.gravity) {
      this.gravity.destruct();
    }
    if (this.settings.planet) {
      this.moon.destruct();
    }
    this.speedcap.destruct();
    this.app.ticker.remove(this.update, this);

    this.app.ticker = new Pixi.ticker.Ticker()
    delete this.starfield;
    super.destroy();
    Matter.Engine.clear(this.engine);
    delete this.player;
    delete this.player2;
    delete this.ship;
    delete this.ship2;
  }

}

module.exports = Game;
