'use strict';

var items = require('../../static/assets/items.json');

function Card(game, x, y, assetName, multiUse = false) {
  Phaser.Sprite.call(this, game, x, y, assetName);
  this._game = game;
  this.assetName = assetName;
  this.key = assetName;
  this.description = 'test';
  this.multiUse = multiUse;
}

Card.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = Card.prototype.constructor = Card;

Card.prototype.getName = function () {
  return items[this.key]['name'];
};

Card.prototype.getDescription = function () {
  return items[this.key]['desc'];
};
