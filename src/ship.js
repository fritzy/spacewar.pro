const Thing = require('./thing');
const Pixi = require('pixi.js');
const Matter = require('matter-js');
const Missile = require('./missile');
const Bargraph = require('./bargraph');
const Beam = require('./beam');

class Ship extends Thing {

    constructor(game, img, x, y, left) {

        const sprite = new Pixi.Sprite(game.resources[img].texture);
        const body = Matter.Bodies.circle(x, y, 16, {
            frictionAir: 0,
            frictionStatic: 0,
        });
        sprite.anchor.set(.5);
        sprite.scale.set(2);

        super(game, body, sprite, 'SHIP');
        this.game = game;

        this.shield = 30;
        this.energy = 30;
        this.shieldIcon = new Pixi.Sprite.fromFrame('kosov-s');
        this.shieldIcon.position.set(left ? 5 : this.game.width - 115, 6);
        this.shieldGraph = new Bargraph(game, left ? 20 : this.game.width - 100, 5)
        this.shieldGraph.draw(this.shield);

        this.energyIcon = new Pixi.Sprite.fromFrame('kosov-e');
        this.energyIcon.position.set(left ? 4 : this.game.width - 116, 25);
        this.energyGraph = new Bargraph(game, left ? 20 : this.game.width - 100, 26)
        this.energyGraph.draw(this.energy);
        this.missiles = [];
        this.lastEnergyBump = 0;
        this.game.app.stage.addChild(this.energyIcon);
        this.game.app.stage.addChild(this.shieldIcon);
        this.beam = null;

        this.game.app.ticker.add(() => {

            const dt = this.game.app.ticker.elapsedMS;
            this.lastEnergyBump += dt;
            if (this.lastEnergyBump >= 1000) {
                this.lastEnergyBump = 0;
                if (this.energy < 30) {
                    this.energy += 1;
                    this.energyGraph.draw(this.energy);
                } else if (this.shield < 30) {
                    this.shield += 1;
                    this.shieldGraph.draw(this.shield);
                }
            }
        });
    }
    
    fireMissile() {
        
        if (this.missiles.length < 8) {
            this.missiles.push(new Missile(this.game, this));
            this.useEnergy(2);
        }
    }

    fireBeam() {
        
        if (this.beam === null || this.beam.destroyed) {
            this.beam = new Beam(this.game, this);
            this.useEnergy(4);
        }
    }

    adjust(dir) {

        if (dir === -1 && this.energy < 30 && this.shield > 1) {
            this.shield -= 1;
            this.energy += 1;
        } else if (dir === 1 && this.shield < 30 && this.energy > 1){
            this.energy -= 1;
            this.shield += 1;
        }
        this.energyGraph.draw(this.energy);
        this.shieldGraph.draw(this.shield);
    }

    useEnergy(amt) {

        this.energy -= amt;
        this.energyGraph.draw(this.energy);
    }
    
    damage(dmg) {
        this.shield -= dmg;
        if (this.shield <= 0) {
            this.shield = 0;
            this.destruct();
        }
        this.shieldGraph.draw(this.shield);
    }

    collide(other) {

        if (other.type === 'MISSILE') {
            this.damage(4);
        }
    }
}

module.exports = Ship;
