class AIState {

  constructor(ai, name, maxTime) {

    this.ai = ai;
    this.ship = ai.ship;
    this.target = ai.target;
    this.game = ai.game;

    this.name = name;
    this.held = 0;
    this.maxTime = maxTime;
    this.done = false;
  }

  update(dt, du) {

    this.held += dt;
    if (this.held >= this.maxTime) {
      this.done = true;
    }
  }

  destroy() {
  }

}

module.exports = AIState;
