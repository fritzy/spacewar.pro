const Thing = require('./thing');
const Matter = require('matter-js');
const Pixi = require('pixi.js');

class Missile extends Thing {

    constructor(game, ship) {

        const sprite = new Pixi.Sprite(game.resources.missile.texture);
        sprite.scale.set(2);
        sprite.anchor.set(.5);

        let pos = Matter.Vector.clone(ship.body.position);
        pos = Matter.Vector.add(
            pos,
            Matter.Vector.create(
                Math.sin(ship.body.angle) * 24,
                Math.cos(ship.body.angle) * -24
            )
        );
        const body = Matter.Bodies.circle(pos.x, pos.y, 8,
            {
                angle: ship.body.angle,
                frictionAir: 0,
                frictionStatic: 0,
                isSensor: true
            });
        Matter.Body.setVelocity(body,
            Matter.Vector.add(
                ship.body.velocity,
                Matter.Vector.create(
                    Math.sin(ship.body.angle) * 5,
                    Math.cos(ship.body.angle) * -5,
                )));

        super(game, body, sprite, 'MISSILE');
        this.game = game;
        this.ship = ship;
        this.life = 0;

        this.game.app.ticker.add(this.update, this);
    }

    update () {

        this.life += this.game.app.ticker.elapsedMS;
        if (this.life > 3000) {
            this.destruct();
        }
    }

    destruct() {

        super.destruct();
        this.ship.missiles.splice(this.ship.missiles.indexOf(this), 1);
        this.game.app.ticker.remove(this.update, this);
    }

    collide(other) {

        super.collide(other);
        this.destruct();
    }
}

module.exports = Missile;
