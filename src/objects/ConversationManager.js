/*
 * ConversationManager
 * ===================
 *
 * Handles loading JSON assets for conversation and managing conversation state
 */

'use strict';

module.exports = ConversationManager;

function ConversationManager(game/*, ...args*/) {
  Phaser.Group.call(this, game/*, ...args*/);

  // PROPERTIES:
  // - conversation - json conversation

  this.conversation = null;
  this.idx = 0;
}
ConversationManager.prototype = Object.create(Phaser.Group.prototype);
ConversationManager.prototype.constructor = ConversationManager;

/* Assumes JSON has already been loaded into cache!
 * Use game.load.json otherwise
 */
ConversationManager.prototype.loadJSONConversation = function (game, jsonKey) {
  var json = game.cache.getJSON(jsonKey);

  this.conversation = json;
};

ConversationManager.prototype.getCurrentText = function () {
  if (this.conversation === null) {
    return '';
  }

  return this.conversation[this.idx]['text'];
};

ConversationManager.prototype.getResponses = function () {
  if (this.conversation === null) {
    return [''];
  }

  return this.conversation[this.idx]['responses'];
};

ConversationManager.prototype.update = function () {
  // TODO: Stub.
};
