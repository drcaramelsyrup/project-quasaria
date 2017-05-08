/*
 * ArgumentManager
 * ===============
 *
 * Extension of ConversationManager for Logic Battles
 */

'use strict';

var ConversationManager = require('./ConversationManager');

module.exports = ArgumentManager;

function ArgumentManager(game/*, ...args*/) {
  // TODO:
  //   1. Edit constructor parameters accordingly.
  //   2. Adjust object properties.

  this._game = game;

}
ArgumentManager.prototype = Object.create(ConversationManager.prototype);
ArgumentManager.prototype.constructor = ArgumentManager;

ArgumentManager.prototype.update = function () {
  // TODO: Stub.
};

/** BEGIN OVERRIDE FUNCTIONS */
ArgumentManager.prototype.getResponses = function () {
  return [];
};

ArgumentManager.prototype.getAvatar = function () {
  return 'invisible';
};

ArgumentManager.prototype.takeActions = function () {
  /** stub */
};
/** END OVERRIDE FUNCTIONS */

ArgumentManager.prototype.getCurrentCounters = function () {
  return this.conversation[this.idx]['counters'];
};

ArgumentManager.prototype.setArgumentByIndex = function (idx) {
  this.idx = idx;
};

ArgumentManager.prototype.setArgumentById = function (id) {
  for (var i = 0; i < this.conversation.length; i++) {
    if (this.conversation[i]['id'] === id) {
      this.idx = i;
      return;
    }
  }
};
