/*
 * Placeable
 * ====
 *
 * A sample prefab (extended game object class), displaying an object in a room
 * (usually larger than a clickable) that can be clicked on to display a message,
 * but not added to the player's inventory.
 */

'use strict';

var Toast = require('./Toast');
var items = require('../../static/assets/items.json');

function Placeable(game, x, y, id, height, width, message) {
  Phaser.Sprite.call(this, game, x, y, id);
  this.height = height;
  this.width = width;

  this._game = game;
  this.id = id;
  this.message = items[id]['message'];
  this.anchor.set(0.5);
  this.inputEnabled = true;
  this.input.useHandCursor = true;
  this.events.onInputDown.add(click, this);
}

function click() {
  this._game.add.existing(new Toast(this._game, this.message, 5));
}

Placeable.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = Placeable.prototype.constructor = Placeable;