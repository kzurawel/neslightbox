const { BrowserWindow } = require('electron');

function __handleWillResize (event, newSize) {
  event.preventDefault();
  event.sender.setSize(newSize.width, parseInt(newSize.width * this.height / this.width));
}

class RatioWindow extends BrowserWindow {
  constructor (options) {
    super(options);
    this.on('will-resize', __handleWillResize.bind(options));
  }
}

module.exports = RatioWindow;
