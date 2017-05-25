const Pixi = require('pixi.js');
const Game = require('./src/game.js');
const Menu = require('./src/menu.js');
const Matter = require('matter-js');

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

    Pixi.loader.add('ship1', 'assets/ship1.png'); 
    Pixi.loader.add('ship2', 'assets/ship2.png'); 
    Pixi.loader.add('missile1', 'assets/missile.png'); 
    Pixi.loader.add('missile2', 'assets/missile2.png'); 
    Pixi.loader.add('moon', 'assets/moon.png'); 
    Pixi.loader.add('check', 'assets/check.png'); 
    Pixi.loader.add('menu', 'assets/menu.png');
    Pixi.loader.add('kosov', 'assets/kosov2.png'); 
    Pixi.loader.load((loader, resources) => {

      this.resources = resources;
      this.startMenu();
      this.update();
    });

  }

  clear() {

    if (this.scene !== null) {
      this.scene.destroy();
    }
  }

  update(t) {

    const dt = (t - this.lastTime);
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
