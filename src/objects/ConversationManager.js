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

  this._game = game;

  this.conversation = null;
  this.idx = 0;
}
ConversationManager.prototype = Object.create(Phaser.Group.prototype);
ConversationManager.prototype.constructor = ConversationManager;

/* Assumes JSON has already been loaded into cache!
 * Use game.load.json otherwise
 */
ConversationManager.prototype.loadJSONConversation = function (jsonKey) {
  var json = this._game.cache.getJSON(jsonKey);

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
  var responses = this.conversation[this.idx]['responses'];
  var ret = [];
  for (var i = 0; i < responses.length; i++) {
    if ('conditions' in responses[i]) {
      var conditionsNeeded = 0;
      var conditionsMet = 0;
      for (var condition in responses[i]['conditions']) {
        if (checkCondition(this._game, condition, responses[i]['conditions'][condition])) {
          conditionsMet++;
        }
        conditionsNeeded++;
      }
      if (conditionsMet >= conditionsNeeded) {
        ret.push(responses[i]); //if all conditions are met, display response
      }
    } else {
      ret.push(responses[i]);   //no conditions on this response, display it
    }
  }

  return ret;
};

function checkCondition(game, condition, value) {
  if (condition.startsWith('var')) {
    var variable = condition.substring(3);
    if (value.startsWith('!')) {
      if (!(variable in game.player.variables) || game.player.variables[variable] !== value.substring(1)) {
        return true;    //player does not have this variable set, or has it set to a different value
      }
    } else if (variable in game.player.variables && game.player.variables[variable] === value) {
      return true;      //player has this variable set to this value
    }
  } else if (condition.startsWith('inv')) {
    var item = condition.substring(3);
    if (value.startsWith('!')) {
      if (game.player.inventory.indexOf(item) === -1) {
        return true;    //player does not have this inventory item
      }
    } else if (game.player.inventory.indexOf(item) > -1) {
      return true;      //player has this inventory item
    }
  }
  return false;
}

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

ConversationManager.prototype.takeActions = function() {
  if (this.conversation === null) {
    return;
  }

  if (this.conversation[this.idx]['actions'].length === 0) {
    return;
  }

  for (var action in this.conversation[this.idx]['actions']) {
    takeAction(this._game, action, this.conversation[this.idx]['actions'][action]);
    return;
  }
};

function takeAction(game, action, value) {
  if (action.startsWith('var')) {
    var variable = action.substring(3);
    if (value.startsWith('!')) {
      delete game.player.variables[variable]; //remove variable from player
    } else {
      game.player.variables[variable] = value;  //set variable on player
    }
  } else if (action.startsWith('inv')) {
    var item = action.substring(3);
    if (value.startsWith('!')) {
      if (!(item in game.player.inventory)) {
        var index = game.player.inventory.indexOf(item);
        if (index > -1) {
          game.player.inventory.splice(index, 1); //remove item from player inventory
        }
      }
    } else {
      game.player.inventory.push(item); //add item to player inventory
    }
  }
}

ConversationManager.prototype.update = function () {
  // TODO: Stub.
};
