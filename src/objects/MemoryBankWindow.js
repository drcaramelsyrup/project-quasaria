/*
 * MemoryBankWindow
 * ===============
 *
 * UI window for the memory bank
 */

'use strict';

module.exports = MemoryBankWindow;

function MemoryBankWindow(game/*, ...args*/) {
  Phaser.Group.call(this, game/*, ...args*/);

  // TODO:
  //   1. Edit constructor parameters accordingly.
  //   2. Adjust object properties.

  this._game = game;
}
MemoryBankWindow.prototype = Object.create(Phaser.Group.prototype);
MemoryBankWindow.prototype.constructor = MemoryBankWindow;

MemoryBankWindow.prototype.update = function () {
  // TODO: Stub.
};
