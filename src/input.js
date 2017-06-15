class Input {

  constructor(game, up, down) {

    this.keys = {};
    this.down = (event) => {

      if (event.key) {
        if (event.code === 'Space' || event.code === 'Enter') {
          event.preventDefault();
        }
        this.keys[event.key] = true;
        this.keys[event.code] = true;
      }
      if (event.btn) {
        this.keys[event.btn] = true;
      }
      down(event, this.keys);
    };

    this.up = (event) => {

      if (event.key) {
        delete this.keys[event.key];
        delete this.keys[event.code];
      }
      if (event.btn) {
        delete this.keys[event.btn];
      }
      up(event, this.keys);
    };

    this.newGamepad = (e) => {
      console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
        e.gamepad.index, e.gamepad.id,
        e.gamepad.buttons.length, e.gamepad.axes.length);
    };

    window.addEventListener('gamepadconnected', this.newGamepad, true);
    window.addEventListener('keydown', this.down, true);
    window.addEventListener('keyup', this.up, true);
  }

  update(dt, du) {

    for (let gp of navigator.getGamepads()) {
      if (gp !== null) {
        for (let bidx in gp.buttons) {
          const btn = `${gp.index}.${bidx}`;
          if (gp.buttons[bidx].pressed && !this.keys[btn]) {
            this.down({ btn });
          } else if (this.keys[btn] && !gp.buttons[bidx].pressed) {
            this.up({ btn });
          }
        }
      }
    }
  }

  destroy() {

    window.removeEventListener('gamepadconnected', this.newGamepad, true);
    window.removeEventListener('keydown', this.down, true);
    window.removeEventListener('keyup', this.up, true);
  }
}

module.exports = Input;
