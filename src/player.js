const Matter = require('matter-js');
const Body = Matter.Body;
const Vector = Matter.Vector;

class Player {

    constructor(game, thing, controls) {

        this.thing = thing;
        this.game = game;
        this.keys = {};
        this.controls = controls;
        this.held = {};

        window.addEventListener('keydown', (e) => {

            if (this.keys[e.key]) {
                return false;
            }
            this.keys[e.key] = true;
            this.held[e.key] = 0;
            if (e.key === this.controls.missile && this.thing.energy >= 2) {
                thing.fireMissile();
            }
            if (e.key === this.controls.laser && this.thing.energy >= 4) {
                thing.fireBeam();
            }
            if (e.key === this.controls.thrust && this.thing.energy >= 1) {
                //thing.useEnergy(1);
            }
        });
        window.addEventListener('keyup', (e) => {

            delete this.keys[e.key];
        });

        const body = this.thing.body;
        this.game.app.ticker.add(() => {

            const dt = this.game.app.ticker.elapsedMS;

            for (let key of Object.keys(this.keys)) {
                this.held[key] += dt;
            }

            if (this.keys[this.controls.addshield]) {
                this.thing.adjust(1);
            } else if (this.keys[this.controls.addenergy]) {
                this.thing.adjust(-1);
            }


            if (this.keys[this.controls.thrust] && this.thing.energy >= 1) {
                if (this.held[this.controls.thrust] > 1000) {
                    this.held[this.controls.thrust] = 0;
                    //this.thing.useEnergy(1);
                }
                Body.applyForce(
                    this.thing.body,
                    body.position,
                    Vector.create(
                        Math.sin(body.angle) * dt * .00001,
                        Math.cos(body.angle) * dt * -.00001
                    )
                );
            }
            if (this.keys[this.controls.left] && this.thing.energy >= 1) {
                Body.rotate(body, -.05);
                Body.setAngularVelocity(body, 0);
            }
            if (this.keys[this.controls.right] && this.thing.energy >= 1) {
                Body.setAngularVelocity(body, 0);
                Body.rotate(body, .05);
            }
        });
    }
}

module.exports = Player;
