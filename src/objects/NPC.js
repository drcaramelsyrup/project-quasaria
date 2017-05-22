/*
 * NPC
 * ====
 *
 * A sample prefab (extended game object class), displaying an NPC in a room.
 */

'use strict';

var npcs = require('../../static/assets/npcs.json');
var Toast = require('./Toast');

function NPC(game, x, y, id, height, width) {
  this.id = id;
  this.img = npcs[id]['image'];
  Phaser.Sprite.call(this, game, x, y, this.img);
  this.height = height;
  this.width = width;
  this.name = npcs[id]['name'];

  this._game = game;
  this.conv = npcs[id]['conv'];
  this.anchor.set(0.5);
  this.inputEnabled = true;
  this.input.useHandCursor = true;
  this.events.onInputDown.add(click, this);
  this.events.onInputOver.add(mouseover, this);
  this.events.onInputOut.add(mouseout, this);
}

NPC.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = NPC.prototype.constructor = NPC;

function click() {
  this.hide();
  this._game.dialogueWindow.begin(this.conv);
}

function mouseover() {
  this._game.add.existing(this.toast = new Toast(this._game, this.name, 5));
}

function mouseout() {
  if (this.toast) {
    this.toast.toast.container.displayGroup.removeAll();
    this.toast.destroy();
  }
}

NPC.prototype.show = function() {
  var fadeInTween = this._game.add.tween(this);
  var fadeIn = 200;
  fadeInTween.to({alpha: 1}, fadeIn, Phaser.Easing.Linear.None, true);
};

NPC.prototype.hide = function() {
  var fadeOutTween = this._game.add.tween(this);
  var fadeOut = 200;
  fadeOutTween.to({alpha: 0}, fadeOut, Phaser.Easing.Linear.None, true);
};
