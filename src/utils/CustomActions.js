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
  if (action.startsWith('fadeInAndOut')) {
  	this.fadeInAndOut(parseInt(action.substring('fadeInAndOut'.length)));
  }
  else if (action === 'startConv:prologue02') {
    this._game.camera.fade('#000000', 2000);
    this._game.camera.onFadeComplete.addOnce(function() {
      this._game.camera.flash('#000000', 2000);
      this.startConversation('prologue02');
    }, this);
  }
};

CustomActions.prototype.startConversation = function(conv) {
  this._game.dialogueWindow.begin(conv);
};

CustomActions.prototype.fadeInAndOut = function(duration) {
  this._game.camera.fade('#000000', duration/2);
  this._game.dialogueWindow.avatar.visible = false;
  this._game.dialogueWindow.dialogPanel.visible = false;
  this._game.camera.onFadeComplete.addOnce(function() {
  	this._game.camera.flash('#000000', duration/2);
  	this._game.dialogueWindow.avatar.visible = true;
  	this._game.dialogueWindow.dialogPanel.visible = true;
  }, this);
};