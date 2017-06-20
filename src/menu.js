const Pixi = require('pixi.js');
const Scene = require('./scene');
const Starfield = require('./starfield');
const Game = require('./game');

class Menu extends Scene {

  start() {

    this.sf = new Starfield(this);
    this.bg = new Pixi.Sprite(this.resources.menu.texture);
    this.stage.addChild(this.bg);

    this.pointer = new Pixi.Sprite(this.resources.missile1.texture);
    this.pointer.tint = 0x55FFFF;
    this.pointer.position.set(415, 240);
    this.pointer.anchor.set(.5);
    this.pointer.scale.set(3);
    this.pointer.rotation = Math.PI / 2;
    this.stage.addChild(this.pointer);

    this.pointerPos = 0;
    this.pointerPoses = [
      { x: 415, y: 240 },
      { x: 415, y: 286 },
      { x: 415, y: 332 },
      { x: 435, y: 382 },
      { x: 435, y: 409 },
      { x: 435, y: 438 },
      { x: 435, y: 466 },
    ];

    this.start1p = new Pixi.Graphics();
    this.start1p.lineStyle(4, 0xFFFFFF);
    this.start1p.drawRect(0, 0, 333, 35);
    this.start1p.position.set(440, 224)
    this.stage.addChild(this.start1p);
    this.start1p.interactive = true;
    this.start1p.hitArea = new Pixi.Rectangle(0, 0, 333, 35);
    this.start1p.renderable = false;

    this.start2p = new Pixi.Graphics();
    this.start2p.lineStyle(4, 0xFFFFFF);
    this.start2p.drawRect(0, 0, 333, 35);
    this.start2p.position.set(440, 270)
    this.stage.addChild(this.start2p);
    this.start2p.interactive = true;
    this.start2p.hitArea = new Pixi.Rectangle(0, 0, 333, 35);
    this.start2p.renderable = false;

    this.startai = new Pixi.Graphics();
    this.startai.lineStyle(4, 0xFFFFFF);
    this.startai.drawRect(0, 0, 333, 35);
    this.startai.position.set(440, 315)
    this.stage.addChild(this.startai);
    this.startai.interactive = true;
    this.startai.hitArea = new Pixi.Rectangle(0, 0, 333, 35);
    this.startai.renderable = false;

    this.soundb = new Pixi.Graphics();
    this.soundb.lineStyle(2, 0xFFFFFF);
    this.soundb.drawRect(0, 0, 17, 17);
    this.soundb.position.set(460, 374);
    this.stage.addChild(this.soundb);
    this.soundb.interactive = true;
    this.soundb.hitArea = new Pixi.Rectangle(0, 0, 17, 17);

    this.gravb = new Pixi.Graphics();
    this.gravb.lineStyle(2, 0xFFFFFF);
    this.gravb.drawRect(0, 0, 17, 17);
    this.gravb.position.set(460, 401)
    this.stage.addChild(this.gravb);
    this.gravb.interactive = true;
    this.gravb.hitArea = new Pixi.Rectangle(0, 0, 17, 17);

    this.planb = new Pixi.Graphics();
    this.planb.lineStyle(2, 0xFFFFFF);
    this.planb.drawRect(0, 0, 17, 17);
    this.planb.position.set(460, 430)
    this.stage.addChild(this.planb);
    this.planb.interactive = true;
    this.planb.hitArea = new Pixi.Rectangle(0, 0, 17, 17);

    this.missb = new Pixi.Graphics();
    this.missb.lineStyle(2, 0xFFFFFF);
    this.missb.drawRect(0, 0, 17, 17);
    this.missb.position.set(460, 458);
    this.stage.addChild(this.missb);
    this.missb.interactive = true;
    this.missb.hitArea = new Pixi.Rectangle(0, 0, 17, 17);

    this.sounds = new Pixi.Sprite(this.resources.check.texture);
    this.sounds.position.set(460, 374);
    this.sounds.tint = 0xFF55FF;
    this.stage.addChild(this.sounds);

    this.gravs = new Pixi.Sprite(this.resources.check.texture);
    this.gravs.position.set(460, 401);
    this.gravs.tint = 0xFF55FF;
    this.stage.addChild(this.gravs);

    this.plans = new Pixi.Sprite(this.resources.check.texture);
    this.plans.position.set(460, 430);
    this.plans.tint = 0xFF55FF;
    this.stage.addChild(this.plans);

    this.misss = new Pixi.Sprite(this.resources.check.texture);
    this.misss.position.set(460, 458);
    this.misss.tint = 0xFF55FF;
    this.stage.addChild(this.misss);


    this.settings = {
      sound: window.localStorage.getItem('sw_sound') === "false" ? false : true,
      gravity: window.localStorage.getItem('sw_gravity') === "true" ? true : false,
      planet: window.localStorage.getItem('sw_planet') === "false" ? false : true,
      mseek: window.localStorage.getItem('sw_mseek') === "false" ? false : true,
      pcolors: [0x55FFFF, 0xFF55FF],
      scolors: [0x55FFFF, 0xFF55FF]
    };

    this.sounds.renderable = this.settings.sound;
    this.plans.renderable = this.settings.planet;
    this.gravs.renderable = this.settings.gravity;
    this.misss.renderable = this.settings.mseek;

    Howler.volume(this.settings.sound ? 1 : 0);

    this.soundb.on('mousedown', () => {

      this.toggleSound();
    });

    this.gravb.on('mousedown', () => {

      this.toggleGravity();
    });


    this.planb.on('mousedown', () => {

      this.togglePlanet();
    });

    this.missb.on('mousedown', () => {

      this.toggleSeek();
    });

    this.start1p.on('mousedown', () => {

      this.settings.airight = true;
      this.settings.aileft = false;
      this.main.startGame(this.settings);
    });

    this.start2p.on('mousedown', () => {

      this.settings.airight = false;
      this.settings.aileft = false;
      this.main.ready2P(this.settings);
    });

    this.startai.on('mousedown', () => {

      this.settings.airight = true;
      this.settings.aileft = true;
      this.main.startGame(this.settings);
    });

    const leftScoreC = new Pixi.Container();
    this.stage.addChild(leftScoreC);
    const leftchars = String(this.main.leftScore).split('');
    let width = 0;
    for (let letter of leftchars) {
      const sprite = new Pixi.Sprite.fromFrame(`aether-${letter}`);
      sprite.scale.set(2);
      sprite.position.set(width, 0);
      width += sprite.width;
      leftScoreC.addChild(sprite);
    }
    leftScoreC.position.set(131, 390);

    const rightScoreC = new Pixi.Container();
    this.stage.addChild(rightScoreC);
    const rightchars = String(this.main.rightScore).split('');
    width = 0;
    for (let letter of rightchars) {
      const sprite = new Pixi.Sprite.fromFrame(`aether-${letter}`);
      sprite.scale.set(2);
      sprite.position.set(width, 0);
      width += sprite.width;
      rightScoreC.addChild(sprite);
    }
    rightScoreC.position.set(330, 390);
     


    this.leftShip = new Pixi.Sprite(this.resources.ship1.texture);
    this.rightShip = new Pixi.Sprite(this.resources.ship2.texture);
    this.rightShip.scale.set(2);
    this.rightShip.anchor.set(.5);
    this.rightShip.tint = this.settings.scolors[1];
    //this.rightShip.rotation = -Math.PI / 2;
    this.leftShip.scale.set(2);
    this.leftShip.anchor.set(.5);
    this.leftShip.tint = this.settings.scolors[0];
    this.leftShip.position.set(100, 400);
    //this.leftShip.rotation = Math.PI / 2;
    this.rightShip.position.set(300, 400);
    this.stage.addChild(this.leftShip);
    this.stage.addChild(this.rightShip);

    const logoContainer = new Pixi.Container();
    this.stage.addChild(logoContainer);
    const logotext = ['s', 'p', 'a', 'c', 'e', 'w', 'a', 'r'];
    this.logosprites = [];
    let logowidth = 0;
    for (let letter of logotext) {
      const sprite = new Pixi.Sprite.fromFrame(`kosov-${letter}`);
      sprite.scale.set(4);
      sprite.position.set(logowidth, 30);
      logowidth += sprite.width;
      logoContainer.addChild(sprite);
      this.logosprites.push(sprite);
    }
    logoContainer.position.set(this.main.width / 2 - logowidth / 2, 40);

    this.r = 0;
    this.seg = Math.PI * 2 / 8;
  }

  toggleGravity() {

    this.settings.gravity = !this.settings.gravity;
    window.localStorage.setItem('sw_gravity', this.settings.gravity);
    this.gravs.renderable = this.settings.gravity;
  }

  togglePlanet() {

    this.settings.planet = !this.settings.planet;
    window.localStorage.setItem('sw_planet', this.settings.planet);
    this.plans.renderable = this.settings.planet;
  }

  toggleSound() {

    this.settings.sound = !this.settings.sound;
    window.localStorage.setItem('sw_sound', this.settings.sound);
    this.sounds.renderable = this.settings.sound;
    Howler.volume(this.settings.sound ? 1 : 0);
  }

  toggleSeek() {

    this.settings.mseek = !this.settings.mseek;
    window.localStorage.setItem('sw_mseek', this.settings.mseek);
    this.misss.renderable = this.settings.mseek;
  }

  down(event) {

    if (event.key === 's' || (event.btn && event.btn.substr(-3) === '.13')) {
      this.pointerPos += 1;
      if (this.pointerPos >= this.pointerPoses.length) {
        this.pointerPos = 0;
      }
    } else if (event.key === 'w' || (event.btn && event.btn.substr(-3) === '.12')) {
      this.pointerPos -= 1;
      if (this.pointerPos < 0) {
        this.pointerPos = this.pointerPoses.length - 1;
      }
    } else if (event.code === 'Enter' || event.code === 'Space' || (event.hit !== '14' && event.hit !== '15')) {
      if (this.pointerPos === 0) {
        this.settings.airight = true;
        this.settings.aileft = false;
        this.main.startGame(this.settings);
      } else if (this.pointerPos === 1) {
        this.settings.airight = false;
        this.settings.aileft = false;
        this.main.ready2P(this.settings);
      }else if (this.pointerPos === 2) {
        this.settings.airight = true;
        this.settings.aileft = true;
        this.main.startGame(this.settings);
      } else if (this.pointerPos === 3) {
        this.toggleSound();
      } else if (this.pointerPos === 4) {
        this.toggleGravity();
      } else if (this.pointerPos === 5) {
        this.togglePlanet();
      } else if (this.pointerPos === 6) {
        this.toggleSeek();
      }
    }
    this.pointer.position.set(this.pointerPoses[this.pointerPos].x,this.pointerPoses[this.pointerPos].y);
  }


  update(dt, du) {

    this.r = this.r + du * .1;
    this.r %= Math.PI * 2;
    let s = 0;
    for (let sprite of this.logosprites) {
      sprite.position.y = 30 + Math.cos(this.r + s) * 15;
      s += this.seg;
    }
    this.pointer.scale.set(3 + Math.cos(this.r) * -1);
  }

  destroy() {

    super.destroy();
  }

}

module.exports = Menu;
