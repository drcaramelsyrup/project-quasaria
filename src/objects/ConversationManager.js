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

ConversationManager.prototype.getResponses = function (game) {
  if (this.conversation === null) {
    return [''];
  }
  var responses = this.conversation[this.idx]['responses'];
  var ret = [];
  for (var i = 0; i < responses.length; i++) {
    if ('conditions' in responses[i]) {
      var conditionsNeeded = 0;
      var conditionsMet = 0;
      for (var condition in responses[i]['conditions']) {
        if (responses[i]['conditions'][condition].startsWith('!')) {
          if (!(condition in game.player.variables) || game.player.variables[condition] !== responses[i]['conditions'][condition].substring(1)) {
            conditionsMet++;
          }
        }
        else if (condition in game.player.variables && game.player.variables[condition] === responses[i]['conditions'][condition]) {
          conditionsMet++;
        }
        conditionsNeeded++;
      }
      if (conditionsMet >= conditionsNeeded) {
        ret.push(responses[i]);
      }
    } else {
      ret.push(responses[i]);
    }
  }

  return ret;
};

ConversationManager.prototype.getSpeaker = function () {
  if (this.conversation === null) {
    return [''];
  }

  return this.conversation[this.idx]['speaker'];
};

ConversationManager.prototype.getAvatar = function() {
  if (this.conversation === null) {
    return [''];
  }

  return this.conversation[this.idx]['speaker'].toLowerCase().replace(' ', '-');
};

ConversationManager.prototype.takeAction = function(game) {
  if (this.conversation === null) {
    return;
  }

  if (this.conversation[this.idx]['actions'].length === 0) {
    return;
  }

  for (var action in this.conversation[this.idx]['actions']) {
    game.player.variables[action] = this.conversation[this.idx]['actions'][action];
    return;
  }
};

ConversationManager.prototype.update = function () {
  // TODO: Stub.
};
