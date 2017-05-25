const Pixi = require('pixi.js');

class Scene {
  constructor(main) {

    this.main = main;
    this.stage = new Pixi.Container();
    this.main.app.stage.addChild(this.stage);
    this.resources = this.main.resources;
    this.app = this.main.app;
    this.width = this.main.width;
    this.height = this.main.height;
  }

  destroy() {

    this.stage.destroy();
  }

  update(dt) {

  }
}

module.exports = Scene;
