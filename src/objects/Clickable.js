/*
 * Clickable
 * ====
 *
 * A sample prefab (extended game object class), displaying a clickable object in a room.
 */

'use strict';

var Toast = require('./Toast');

function Clickable(game, x, y, assetName) {
  Phaser.Sprite.call(this, game, x, y, assetName);

  this._game = game;
  this.id = assetName;
  this.name = mappings[assetName];
  this.anchor.set(0.5);
  this.alpha = 0.5;
  this.inputEnabled = true;
  this.input.useHandCursor = true;
  this.events.onInputDown.add(click, this);
  this.events.onInputOver.add(mouseover, this);

}

function click() {
  this.destroy();
  this._game.add.existing(new Toast(this._game, 'You\'ve acquired ' + this.name + '!', 5));
  this._game.player.inventory.push(this.name);
  this._game.dialogueWindow.display(); //refresh dialogue display
}

function mouseover() {
  this.alpha = 1;
}

Clickable.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = Clickable.prototype.constructor = Clickable;

//temporary way of mapping asset ids to their player-facing names
var mappings = {
  'listener-obj': 'Listener',
  'note-obj': 'Indecipherable Note'
};