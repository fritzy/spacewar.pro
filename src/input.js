class Input {

  constructor(game, up, down) {

    this.keys = {};
    this.down = (event) => {

      event.preventDefault();
      this.keys[event.key] = true;
      this.keys[event.code] = true;
      down(event, this.keys);
    };

    this.up = (event) => {

      event.preventDefault();
      delete this.keys[event.key];
      delete this.keys[event.code];
      up(event, this.keys);
    };

    window.addEventListener('keydown', this.down, true);
    window.addEventListener('keyup', this.up, true);
  }

  update(dt, du) {

  }

  destroy() {

    window.removeEventListener('keydown', this.down, true);
    window.removeEventListener('keyup', this.up, true);
  }
}

module.exports = Input;
