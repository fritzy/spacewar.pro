const Pixi = require('pixi.js');
const Game = require('./src/game.js');
const Menu = require('./src/menu.js');
const Matter = require('matter-js');
const Tween = require('tween.js');
const Input = require('./src/input.js');
const Howler = require('howler');

Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST;
const FMS = 1000/60;

class SpaceWarz {

  constructor() {

    this.scene = null;
    this.app = new Pixi.Application({
      resolution: .5,
      width: 800,
      height: 600
    });
    this.container = document.getElementById('container');
    this.container.appendChild(this.app.view);
    this.width = this.app.screen.width;
    this.height = this.app.screen.height;
    this.lastTime = window.performance.now();
    this.input = new Input(this, this.up.bind(this), this.down.bind(this));

    this.leftScore = 0;
    this.rightScore = 0;

    Pixi.loader.add('ship1', 'assets/ship1.png');
    Pixi.loader.add('ship2', 'assets/ship2.png');
    Pixi.loader.add('missile1', 'assets/missile.png');
    Pixi.loader.add('missile2', 'assets/missile2.png');
    Pixi.loader.add('moon', 'assets/moon.png');
    Pixi.loader.add('check', 'assets/check.png');
    Pixi.loader.add('menu', 'assets/menu.png');
    Pixi.loader.add('kosov', 'assets/kosov2.png');
    Pixi.loader.add('aether', 'assets/aether-v2.png');
    Pixi.loader.load((loader, resources) => {

      this.resources = resources;

      const kosove = new Pixi.Texture(this.resources.kosov.texture.baseTexture);
      kosove.frame = new Pixi.Rectangle(60,0,15,14);
      Pixi.Texture.addToCache(kosove, `kosov-e`);

      const kosovs = new Pixi.Texture(this.resources.kosov.texture.baseTexture);
      kosovs.frame = new Pixi.Rectangle(46,46,15,14);
      Pixi.Texture.addToCache(kosovs, `kosov-s`);

      const kosovp = new Pixi.Texture(this.resources.kosov.texture.baseTexture);
      kosovp.frame = new Pixi.Rectangle(0,46,15,14);
      Pixi.Texture.addToCache(kosovp, `kosov-p`);

      const kosova = new Pixi.Texture(this.resources.kosov.texture.baseTexture);
      kosova.frame = new Pixi.Rectangle(0,0,15,14);
      Pixi.Texture.addToCache(kosova, `kosov-a`);

      const kosovc = new Pixi.Texture(this.resources.kosov.texture.baseTexture);
      kosovc.frame = new Pixi.Rectangle(31,0,15,14);
      Pixi.Texture.addToCache(kosovc, `kosov-c`);

      const kosovw = new Pixi.Texture(this.resources.kosov.texture.baseTexture);
      kosovw.frame = new Pixi.Rectangle(30,60,15,14);
      Pixi.Texture.addToCache(kosovw, `kosov-w`);

      const kosovr = new Pixi.Texture(this.resources.kosov.texture.baseTexture);
      kosovr.frame = new Pixi.Rectangle(31,45,15,14);
      Pixi.Texture.addToCache(kosovr, `kosov-r`);


      const loff = [10, 10, 11, 11, 11, 11, 11, 11, 11, 11];
      let width = 0;
      for (let i = 0; i < 10; ++i) {
        const char = new Pixi.Texture(this.resources.aether.texture.baseTexture);
        char.frame = new Pixi.Rectangle(345 + width, 0, loff[i] + 2,12);
        Pixi.Texture.addToCache(char, `aether-${i}`);
        width += loff[i] + 2;
      }


      this.startMenu();
      this.update();
    });

    this.sounds = {
      hit: new Howl({
        src: ['assets/hit.ogg', 'assets/hit.mp3'],
        volume: .3
      }),
      hit2: new Howl({
        src: ['assets/hit2.ogg', 'assets/hit2.mp3'],
        volume: .3
      }),
      beam: new Howl({
        src: ['assets/beam.ogg', 'assets/beam.mp3'],
        volume: .4
      }),
      beamhit: new Howl({
        src: ['assets/beamhit.ogg', 'assets/beamhit.mp3'],
        volume: .4
      }),
      explode: new Howl({
        src: ['assets/explode.ogg', 'assets/explode.mp3'],
        volume: .2
      }),
      explodeship: new Howl({
        src: ['assets/explodeship.ogg', 'assets/explodeship.mp3'],
        volume: .5
      }),
      warp: new Howl({
        src: ['assets/warp3.ogg', 'assets/warp3.mp3'],
        volume: .6
      }),
      launch: new Howl({
        src: ['assets/launch.ogg', 'assets/launch.mp3'],
      })
    };
  }

  clear() {

    if (this.scene !== null) {
      this.scene.destroy();
    }
  }

  up(event, keys) {

    this.scene.up(event, keys);
  }

  down(event, keys) {

    this.scene.down(event, keys);
  }

  update(t) {

    t = t || 0;
    Tween.update(t);
    let dt = (t - this.lastTime);
    if (dt > 25) dt = 25;
    const du = dt / (FMS);
    this.lastTime = t;
    this.scene.update(dt, du);

    window.requestAnimationFrame(this.update.bind(this));
  }

  startMenu() {

    this.clear();
    this.scene = new Menu(this);
    this.scene.start();
  }

  startGame(settings) {

    this.clear();
    this.scene = new Game(this, settings);
    this.scene.start();
  }
}

const sw = new SpaceWarz();
