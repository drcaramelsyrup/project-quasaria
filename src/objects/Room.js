/*
 * Room
 * ====
 *
 * A sample prefab (extended game object class), displaying a room background.
 */

'use strict';

function Room(game, x, y, background) {
  Phaser.Sprite.call(this, game, x, y, background);

  this.anchor.set(0.5);
}
Room.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = Room.prototype.constructor = Room;