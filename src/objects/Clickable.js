/*
 * Clickable
 * ====
 *
 * A sample prefab (extended game object class), displaying a clickable object in a room.
 */

'use strict';

function Clickable(game, x, y, assetName) {
  Phaser.Sprite.call(this, game, x, y, assetName);

  this.anchor.set(0.5);
  this.alpha = 0.5;
  this.inputEnabled = true;
  this.input.useHandCursor = true;
  this.events.onInputDown.add(click, this);
  this.events.onInputOver.add(mouseover, this);

}

function click() {
  this.destroy();
}

function mouseover() {
  this.alpha = 1;
}

Clickable.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = Clickable.prototype.constructor = Clickable;