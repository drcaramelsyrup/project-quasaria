/*
 * Player
 * ====
 *
 * The player object class.
 */

'use strict';

function Player(game) {
  Phaser.Group.call(this, game);

  this.inventory = [];
  this.memoryBank = [];  
}

Player.prototype = Object.create(Phaser.Group.prototype);
module.exports = Player.prototype.constructor = Player;