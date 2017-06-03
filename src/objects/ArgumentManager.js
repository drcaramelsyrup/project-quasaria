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
  this.argIdx = 0;
  this.wantsArgumentText = false;
  this.wantsAbilityText = false;
  this.wantsIntroText = false;
  this.argTextType = 'incorrect';

  this.interludeCompleteSignal = new Phaser.Signal();

}
ArgumentManager.prototype = Object.create(ConversationManager.prototype);
ArgumentManager.prototype.constructor = ArgumentManager;

ArgumentManager.prototype.update = function () {
  // TODO: Stub.
};

/** BEGIN OVERRIDE FUNCTIONS */
ArgumentManager.prototype.getResponses = function () {
  if (this.wantsArgumentText)
    return [{ 'target': this.argIdx+1, 'text': 'Next' }];
  return [];
};

ArgumentManager.prototype.advanceToTarget = function (targetIdx) {
  if (this.wantsArgumentText) {
    if (targetIdx in this.conversation[this.idx][this.argTextType]) {
      this.argIdx = targetIdx;
      return true;
    }

    this.endArgInterlude();
    return false; // do NOT refresh display on end of argument interlude
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

  if (this.wantsArgumentText) {
    return this.conversation[this.idx][this.argTextType][this.argIdx]['text'];
  }

  return this.conversation[this.idx]['text'];
};

ArgumentManager.prototype.getSpeaker = function () {
  if (this.conversation === null) {
    return '';
  }

  if (this.wantsArgumentText) {
    return this.conversation[this.idx][this.argTextType][this.argIdx]['speaker'];
  }

  return npcs[this.conversation[this.idx]['speaker']]['name']; 
};
/** END OVERRIDE FUNCTIONS */

ArgumentManager.prototype.startArgInterlude = function (textType) {
  this.argIdx = 0;
  this.wantsArgumentText = true;
  this.argTextType = textType ? 'correct' : 'incorrect';
};

ArgumentManager.prototype.endArgInterlude = function () {
  this.argIdx = 0;
  this.wantsArgumentText = false;
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
