const Pixi = require('pixi.js');
const Scene = require('./scene');
const Starfield = require('./starfield');

class Menu extends Scene {

  start() {

    this.sf = new Starfield(this);
    this.bg = new Pixi.Sprite(this.resources.menu.texture);
    this.stage.addChild(this.bg);

    this.startb = new Pixi.Graphics();
    this.startb.lineStyle(4, 0xFFFFFF);
    this.startb.drawRect(0, 0, 130, 43);
    this.startb.position.set(512, 290)
    this.stage.addChild(this.startb);
    this.startb.interactive = true;
    this.startb.hitArea = new Pixi.Rectangle(0, 0, 130, 43);

    this.gravb = new Pixi.Graphics();
    this.gravb.lineStyle(2, 0xFFFFFF);
    this.gravb.drawRect(0, 0, 17, 17);
    this.gravb.position.set(525, 396)
    this.stage.addChild(this.gravb);
    this.gravb.interactive = true;
    this.gravb.hitArea = new Pixi.Rectangle(0, 0, 17, 17);

    this.planb = new Pixi.Graphics();
    this.planb.lineStyle(2, 0xFFFFFF);
    this.planb.drawRect(0, 0, 17, 17);
    this.planb.position.set(525, 420)
    this.stage.addChild(this.planb);
    this.planb.interactive = true;
    this.planb.hitArea = new Pixi.Rectangle(0, 0, 17, 17);

    this.plans = new Pixi.Sprite(this.resources.check.texture);
    this.plans.position.set(524, 420);
    this.stage.addChild(this.plans);

    this.gravs = new Pixi.Sprite(this.resources.check.texture);
    this.gravs.position.set(524, 396);
    this.stage.addChild(this.gravs);

    this.settings = {
      gravity: true,
      planet: true
    };

    this.gravb.on('mousedown', () => {

      this.settings.gravity = !this.settings.gravity;
      this.gravs.renderable = this.settings.gravity;
    });

    this.planb.on('mousedown', () => {

      this.settings.planet = !this.settings.planet;
      this.plans.renderable = this.settings.planet;
    });

    this.startb.on('mousedown', () => {

      this.main.startGame(this.settings);
    });


  }
}

module.exports = Menu;
