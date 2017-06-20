const Pixi = require('pixi.js');
const Scene = require('./scene');
const Tween = require('tween.js');
const Starfield = require('./starfield');

class Ready2P extends Scene {

  constructor(main, settings) {

    super(main);
    this.settings = settings;

    this.leftCtrls = {};
    this.rightCtrls = {};
    this.leftText = '';
    
    this.rightText = '';
    this.leftReady = false;
    this.rightReady = false;

    this.sf = new Starfield(this);

    this.bg = new Pixi.Sprite(this.resources.ready2p.texture);
    this.stage.addChild(this.bg);
    
    this.ship1 = new Pixi.Sprite(this.resources.ship1.texture);
    this.ship1.anchor.set(.5);
    this.ship1.scale.set(3);
    this.ship1.tint = 0x55FFFF;
    this.ship1.position.set(200, 300);
    this.stage.addChild(this.ship1);

    this.ship2 = new Pixi.Sprite(this.resources.ship2.texture);
    this.ship2.anchor.set(.5);
    this.ship2.scale.set(3);
    this.ship2.tint = 0xFF55FF;
    this.ship2.position.set(600, 300);
    this.stage.addChild(this.ship2);
  }

  start() {
  }

  down(ev) {

    let ctrlText = '';
    const ctrls = {};
    if (ev.code) {
      if (ev.code === 'KeyS') {

        ctrlText = 'Left Keyboard';
        ctrls['w'] = 'thrust';
        ctrls['a'] = 'left';
        ctrls['d'] = 'right';
        ctrls['s'] = 'missile';
        ctrls['q'] = 'addshield';
        ctrls['e'] = 'addenergy';
        ctrls['c'] = 'laser';
        ctrls['x'] = 'cloak';
        ctrls['z'] = 'warp';


      } else if (ev.code === 'KeyK') {

        ctrlText = 'Right Keyboard';
        ctrls['i'] = 'thrust';
        ctrls['j'] = 'left';
        ctrls['l'] = 'right';
        ctrls['k'] = 'missile';
        ctrls['u'] = 'addshield';
        ctrls['o'] = 'addenergy';
        ctrls['m'] = 'laser';
        ctrls[','] = 'cloak';
        ctrls['.'] = 'warp';

      } else if (ev.code === 'Numpad5') {

        ctrlText = 'Numpad';
        ctrls['Numpad8'] = 'thrust';
        ctrls['Numpad4'] = 'left';
        ctrls['Numpad6'] = 'right';
        ctrls['Numpad5'] = 'missile';
        ctrls['Numpad7'] = 'addshield';
        ctrls['Numpad9'] = 'addenergy';
        ctrls['Numpad3'] = 'laser';
        ctrls['Numpad2'] = 'cloak';
        ctrls['Numpad1'] = 'warp';

      }
    } else if (ev.hit) {
      if (ev.hit === '9') {

        ctrlText = `Controller ${ev.gp + 1}`;
        ctrls[`${ev.gp}.12`] = 'thrust';
        ctrls[`${ev.gp}.14`] = 'left';
        ctrls[`${ev.gp}.15`] = 'right';
        ctrls[`${ev.gp}.2`] = 'missile';
        ctrls[`${ev.gp}.4`] = 'addshield';
        ctrls[`${ev.gp}.5`] = 'addenergy';
        ctrls[`${ev.gp}.0`] = 'laser';
        ctrls[`${ev.gp}.3`] = 'warp';
        ctrls[`${ev.gp}.1`] = 'cloak';

      }
    }

    if (ctrlText) {
      if (!this.leftReady) {
        this.main.sounds.beamhit.play();
        this.leftReady = true;
        this.leftCtrls = ctrls;
        this.leftText = ctrlText;
        const text = new PIXI.Text(ctrlText, {
          fontFamily : 'Monospace',
          fontSize: 30, fill : 0x55FFFF,
          fontWeight: 'bold',
          align : 'center'}
        );
        text.anchor.set(.5);
        text.position.set(-text.width, 350);
        this.stage.addChild(text);
        const pos = { x: -text.width };
        const slide = new Tween.Tween(pos)
        .to({ x: 200 }, 1000)
        .onUpdate(() => {
          text.position.x = pos.x;
        })
        .easing(Tween.Easing.Quadratic.Out);
        slide.start();


      } else if (!this.rightReady && this.leftText !== ctrlText) {

        this.main.sounds.beamhit.play();
        this.rightReady = true;
        this.rightCtrls = ctrls;
        this.rightText = ctrlText;
        const text = new PIXI.Text(ctrlText, {
          fontFamily : 'Monospace',
          fontSize: 30, 
          fill : 0xFF55FF,
          fontWeight: 'bold',
          align : 'center'}
        );
        text.anchor.set(.5);
        text.position.set(800 + text.width, 350);
        this.stage.addChild(text);
        const pos = { x: text.position.x };
        const slide = new Tween.Tween(pos)
        .to({ x: 600 }, 1000)
        .onUpdate(() => {
          text.position.x = pos.x;
        })
        .easing(Tween.Easing.Quadratic.Out);
        slide.start();

      } else if (this.leftReady && this.rightReady) {
        this.main.sounds.beamhit.play();
        this.main.startGame(this.settings, this.leftCtrls, this.rightCtrls);
        return;
      }

      if (this.leftReady && this.rightReady) {
        const text = new PIXI.Text("READY? PRESS START/FIRE!", {
          fontFamily : 'Monospace',
          fontSize: 30, 
          fill : 0xFFFFFF,
          fontWeight: 'bold',
          align : 'center'}
        );
        text.anchor.set(.5);
        text.scale.set(.9);
        text.position.set(400, 600 + text.height);
        this.stage.addChild(text);
        const pos = { y: text.position.y };
        const slide = new Tween.Tween(pos)
        .to({ y: 500 }, 500)
        .delay(1000)
        .onUpdate(() => {
          text.position.y = pos.y;
        })
        .easing(Tween.Easing.Quadratic.In);
        const scale = { z: .9 };
        const zoom = new Tween.Tween(scale)
        .to({ z: 1.1 }, 500)
        .onUpdate(() => {
          text.scale.set(scale.z);
        })
        .easing(Tween.Easing.Circular.In);
        slide.chain(zoom);
        zoom.repeat(Infinity);
        zoom.yoyo(true);
        slide.start();
      }
    }
  }

  destruct() {

    super.destruct();
    Tween.removeAll();
    this.sf.destruct();
  }

}

module.exports = Ready2P;
