/*
 * ArgumentManager
 * ===============
 *
 * Extension of ConversationManager for Logic Battles
 */

'use strict';

var ConversationManager = require('./ConversationManager');
var npcs = require('../../static/assets/npcs.json');

module.exports = ArgumentManager;

function ArgumentManager(game/*, ...args*/) {
  // TODO:
  //   1. Edit constructor parameters accordingly.
  //   2. Adjust object properties.

  ConversationManager.call(this, game);
  this.nestedIdx = 0;
  this.currentParams = [];

  this.introCompleteSignal = new Phaser.Signal();
  this.interludeCompleteSignal = new Phaser.Signal();

}
ArgumentManager.prototype = Object.create(ConversationManager.prototype);
ArgumentManager.prototype.constructor = ArgumentManager;

ArgumentManager.prototype.update = function () {
  // TODO: Stub.
};

/** BEGIN OVERRIDE FUNCTIONS */
ArgumentManager.prototype.getResponses = function () {
  if (this.currentParams.length > 0) {
    return [{ 'target': this.nestedIdx+1, 'text': 'Next', 'params': this.currentParams }];
  }
  return [];
};

ArgumentManager.prototype.advanceToTarget = function (targetIdx, params = []) {
  // pass along current parameters
  this.currentParams = params;
  if (params.length > 0) {
    if (params[0] === 'ability' || params[0] === 'intro' || params[0] === 'custom') {
      var customType = params[0];

      if (targetIdx in this.conversation[customType]) {
        this.nestedIdx = targetIdx;
        return true;
      }

      console.log('end of convo');
      // end of this conversation, go back to whatever we were doing
      this.currentParams = [];
      this.introCompleteSignal.dispatch();
      return true;

    } else if (params.length >= 2 && params[0] === 'interlude') {
      var interludeType = params[1];
      var argument = this.conversation[this.idx];

      if (interludeType in argument && targetIdx in argument[interludeType]) {
        this.nestedIdx = targetIdx;
        return true;
      }

      this.endArgInterlude();
      return false; // do NOT refresh display on end of argument interlude
    }
  }

  this.idx = targetIdx;
  return true;
};

ArgumentManager.prototype.getAvatar = function () {
  return 'invisible';
};

ArgumentManager.prototype.takeActions = function () {
  /** stub */
};

ArgumentManager.prototype.getCurrentText = function () {
  if (this.conversation === null) {
    return '';
  }

  if (this.currentParams.length > 0) {
    var params = this.currentParams;
    if (params[0] === 'ability' || params[0] === 'intro' || params[0] === 'custom') {
      // get special text
      return this.conversation[params[0]][this.nestedIdx]['text'];
    } else if (params.length >= 2 && params[0] === 'interlude') {
      // get interlude text
      return this.conversation[this.idx][params[1]][this.nestedIdx]['text'];
    }
  }

  return this.conversation[this.idx]['text'];
};

ArgumentManager.prototype.getSpeaker = function () {
  if (this.conversation === null) {
    return '';
  }

  if (this.currentParams.length > 0) {
    var params = this.currentParams;
    if (params[0] === 'ability' || params[0] === 'intro' || params[0] === 'custom') {
      // get special text
      return this.conversation[params[0]][this.nestedIdx]['speaker'];
    } else if (params.length >= 2 && params[0] === 'interlude') {
      // get interlude text
      return this.conversation[this.idx][params[1]][this.nestedIdx]['speaker'];
    }
  }

  return npcs[this.conversation[this.idx]['speaker']]['name']; 
};
/** END OVERRIDE FUNCTIONS */

ArgumentManager.prototype.startArgInterlude = function (isCorrect) {
  this.nestedIdx = 0;
  var textType = isCorrect ? 'correct' : 'incorrect';
  this.currentParams = ['interlude', textType];
};

ArgumentManager.prototype.startIntro = function () {
  this.nestedIdx = 0;
  this.currentParams = ['intro'];
};

ArgumentManager.prototype.endArgInterlude = function () {
  this.nestedIdx = 0;
  this.currentParams = [];
  this.interludeCompleteSignal.dispatch();
};

ArgumentManager.prototype.getCurrentCounters = function () {
  return this.conversation[this.idx]['counters'];
};

ArgumentManager.prototype.isNumberProperty = function (property) {
  var n = Math.floor(Number(property));
  return String(n) == property;
};

ArgumentManager.prototype.getAllArguments = function () {
  // returns as an array
  var args = [];
  var keys = Object.keys(this.conversation);
  var prop;
  for (prop in keys) {
    if (this.isNumberProperty(prop) && prop in this.conversation) {
      args.push(this.conversation[prop]);
    }
  }
  return args;
};

ArgumentManager.prototype.getAllAbilities = function () {
  var abilities = [];
  if ('abilities' in this.conversation) {
    var i;
    for (i in this.conversation['abilities']) {
      abilities.push(this.conversation['abilities'][i]);
    }
  }
  return abilities;
};

ArgumentManager.prototype.setArgumentById = function (id) {
  for (var i = 0; i < this.conversation.length; i++) {
    if (this.conversation[i]['id'] === id) {
      this.idx = i;
      return;
    }
  }
};
