/*
 * ConversationManager
 * ===================
 *
 * Handles loading JSON assets for conversation and managing conversation state
 */

'use strict';

module.exports = ConversationManager;

var npcs = require('../../static/assets/npcs.json');

function ConversationManager(game, customActions/*, ...args*/) {
  // PROPERTIES:
  // - conversation - json conversation

  this._game = game;
  this.customActions = customActions;

  this.conversation = null;
  this.idx = 0;
  this.shown = [];
}
ConversationManager.prototype.constructor = ConversationManager;

/* Assumes JSON has already been loaded into cache!
 * Use game.load.json otherwise
 */
ConversationManager.prototype.loadJSONConversation = function (jsonKey) {
  var json = this._game.cache.getJSON(jsonKey);

  this.conversation = json;

  if (this._game.areaTransitionWindow !== null 
    && typeof this._game.areaTransitionWindow !== 'undefined') {
    this._game.areaTransitionWindow.disable();
  }
  //the player object will initialize the start index of a conversation
  // at the end of a conversation the index will return to 0
  // so that the next file will start at the begining.

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
    //check showOnce of target node
    if (this.shown.indexOf(responses[i]['target']) > -1) {    // this node is marked "show once" and has already been shown
      continue;
    }
    //check conditions on response
    if ('conditions' in responses[i]) {
      var conditionsNeeded = 0;
      var conditionsMet = 0;
      for (var condition in responses[i]['conditions']) {
        if (this.checkCondition(this._game, condition, responses[i]['conditions'][condition])) {
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

ConversationManager.prototype.checkCondition = function(game, condition, value) {
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
  } else if (condition.startsWith('seen')) {
    var visited = value.split(' ');
    var visitedAll = true;
    for (var i = 0; i < visited.length; i++) {
      if (this.shown.indexOf(parseInt(visited[i])) === -1) {
        visitedAll = false;
      }
    }
    return visitedAll;
  }
  return false;
};

ConversationManager.prototype.getSpeaker = function () {
  if (this.conversation === null) {
    return [''];
  }

  return npcs[this.conversation[this.idx]['speaker']]['name'];
};

ConversationManager.prototype.getAvatar = function() {
  if (this.conversation === null) {
    return [''];
  }

  return npcs[this.conversation[this.idx]['speaker']]['avatar'];
};

ConversationManager.prototype.takeActions = function() {
  if (this.conversation === null) {
    return;
  }

  if (this.conversation[this.idx]['showOnce'] === 1 && !this.shown.includes(this.idx)) {
    //if save at this point keeps getting resaved.
    this.shown.push(this.idx);
  }

  if (this.conversation[this.idx]['actions'].length === 0) {
    return;
  }

  for (var action in this.conversation[this.idx]['actions']) {
    this.takeAction(this._game, action, this.conversation[this.idx]['actions'][action]);
    return;
  }
};

ConversationManager.prototype.takeAction = function(game, action, value) {
  if (action.startsWith('var')) {
    var variable = action.substring(3);
    if (value.startsWith('!')) {
      delete game.player.variables[variable]; //remove variable from
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
  } else if (action === 'custom') {
    this.customActions.customAction(value);
  }
};

ConversationManager.prototype.endConversation = function() {
  if (this.conversation === null) {
    return;
  }

  for (var i = 0; i < this._game.room.npcs.length; i++) {
    var npc = this._game.room.npcs[i];
    npc.show();
  }
    
  if ('onEnd' in this.conversation) {
    this.customActions.customAction(this.conversation['onEnd']);
  }

  this.shown = [];
  this.idx = 0;
  //think this is a cyclic ref. TODO: fix 
  this._game.dialogueWindow.convoFile = null;
  this._game.areaTransitionWindow.enable();
};

ConversationManager.prototype.update = function () {
  // TODO: Stub.
};
