'use strict';


function Argument(game, x, y, assetName, match, jsonIdx) {
  Phaser.Sprite.call(this, game, x, y, assetName);
  this.assetName = assetName;
  this.inputEnabled = true;
  this.input.useHandCursor = true;
  this.key = match;
  this.jsonIdx = jsonIdx;
  this.shown = false;
}

Argument.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = Argument.prototype.constructor = Argument;
