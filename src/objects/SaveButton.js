/*
 * SaveButton
 * ====
 * Save button, flush player Object to local store.
 *
 */

'use strict';

var Toast = require('./Toast');
var Player = require('./Player');
//var items = require('../../static/assets/items.json');

function SaveButton(game) {
  Phaser.Sprite.call(this, game, 20, 20, 'saveButton');
  this.height = 30;
  this.width = 50;

  this._game = game;
  this.id = 'saveButton';
  this.name = 'Save Button';
  this.anchor.set(0.5);
  this.alpha = 0.5;
  this.inputEnabled = true;
  this.input.useHandCursor = true;
  this.events.onInputDown.add(click, this);
  this.events.onInputOver.add(mouseover, this);
  this.events.onInputOut.add(mouseout, this);
}

function click() {
  this._game.add.existing(new Toast(this._game, 'Game Saved!', 5));
  this._game.dialogueWindow.display(); // refresh dialogue display
  var saveString = this._game.player.serialize();
  console.log(saveString);
  localStorage.setItem('playerState', saveString);
}

function mouseover() {
  this.alpha = 1;
  this._game.add.existing(this.toast = new Toast(this._game, this.name, 5));
}

function mouseout() {
  if (this.toast) {
    this.toast.toast.container.displayGroup.removeAll();
    this.toast.destroy();
  }
}

SaveButton.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = SaveButton.prototype.constructor = SaveButton;
