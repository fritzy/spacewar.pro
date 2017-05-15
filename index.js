const Pixi = require('pixi.js');
const Matter = require('matter-js');
const Player = require('./src/player');
const Ship = require('./src/ship');
const Starfield = require('./src/starfield');

Pixi.settings.SCALE_MODE = Pixi.SCALE_MODES.NEAREST;

class SpaceWarz {
     
    constructor() {

        this.app = new Pixi.Application();
        this.container = document.getElementById('container');
        this.container.appendChild(this.app.view);
        this.width = this.app.screen.width;
        this.height = this.app.screen.height;
        this.engine = Matter.Engine.create();
        this.engine.world.gravity.y = 0;
        console.log(this.width, this.height);

        Matter.Events.on(this.engine, 'collisionStart', (e) => {

            for (let col of e.pairs) {
                col.bodyA.thing.collide(col.bodyB.thing);
                col.bodyB.thing.collide(col.bodyA.thing);
            }
        });

        Pixi.loader.add('ship1', 'assets/ship1.png'); 
        Pixi.loader.add('ship2', 'assets/ship2.png'); 
        Pixi.loader.add('missile', 'assets/missile.png'); 
        Pixi.loader.add('moon', 'assets/moon.png'); 
        //Pixi.loader.add('starfield', 'assets/starfield2.png'); 
        Pixi.loader.add('kosov', 'assets/kosov2.png'); 
        Pixi.loader.load((loader, resources) => {

            this.starField = new Starfield(this);

            this.resources = resources;

            const kosove = new Pixi.Texture(resources.kosov.texture.baseTexture);
            kosove.frame = new Pixi.Rectangle(60,0,15,14);
            Pixi.Texture.addToCache(kosove, `kosov-e`);
            const kosovs = new Pixi.Texture(resources.kosov.texture.baseTexture);
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


            const hw = this.width / 2;
            const hh = this.height / 2;
            this.app.ticker.add(() => {

                /*
                let a = Math.atan2(this.ship.body.position.y - hh, this.ship.body.position.x - hw);
                let v = Matter.Vector.create(Math.cos(a) * -.0001, Math.sin(a) * -.0001 );
                Matter.Body.applyForce(this.ship.body,
                    this.ship.body.position,
                    v);
                */
                Matter.Engine.update(
                    this.engine,
                    1000/60
                );
            });

        })
    }
}

const sw = new SpaceWarz();
