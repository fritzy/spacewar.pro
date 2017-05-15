const Thing = require('./thing');
const Matter = require('matter-js');
const Pixi = require('pixi.js');

class Beam extends Thing {

    constructor(game, ship) {

        const sprite = new Pixi.Graphics();
        sprite.lineStyle(2, 0xFFFFFF);
        sprite.arc(0, 0, 16, -Math.PI, 0);

        //sprite.scale.set(2);
        //sprite.anchor.set(.5);

        let pos = Matter.Vector.clone(ship.body.position);
        /*
        pos = Matter.Vector.add(
            pos,
            Matter.Vector.create(
                Math.sin(ship.body.angle) * 24,
                Math.cos(ship.body.angle) * -24
            )
        );
        */
        const body = Matter.Bodies.circle(pos.x, pos.y, 7,
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

        super(game, body, sprite, 'BEAM');
        this.game = game;
        this.ship = ship;
        this.body = body;
        this.sprite = sprite;
        Matter.Body.scale(this.body, 2, 2);
        
        this.life = 0;
        this.game.app.ticker.add(this.update, this);
    }
    
    update() {
        const dt = this.game.app.ticker.elapsedMS;
        this.sprite.scale.set(this.sprite.scale.x + .003 * dt);
        Matter.Body.scale(this.body, 1 + (.003 * dt / 2), 1 + (.003 * dt / 2));
        this.life += dt;
        if (this.life > 300) {
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
        if (other.type === 'SHIP' && other !== this.ship) {
            other.damage(8);
            this.destruct();
        } else if (other.type === 'MISSILE') {
            other.destruct();
        }
    }
}

module.exports = Beam;
