/*
 * Custom Actions
 * ===================
 *
 * Stores code for custom actions to be taken during conversations.
 */

'use strict';

module.exports = CustomActions;

function CustomActions(game/*, ...args*/) {
  Phaser.Group.call(this, game/*, ...args*/);
  this._game = game;
}

CustomActions.prototype = Object.create(Phaser.Group.prototype);
CustomActions.prototype.constructor = CustomActions;

CustomActions.prototype.customAction = function(action) {
  if (action === 'startConv:prologue02') {
    this._game.camera.fade('#000000', 2000);
    this._game.camera.onFadeComplete.add(function() {
      this._game.camera.flash('#000000', 2000);
      this.startConversation('prologue02');
    }, this);
  }
};

CustomActions.prototype.startConversation = function(conv) {
  this._game.dialogueWindow.begin(conv);
};