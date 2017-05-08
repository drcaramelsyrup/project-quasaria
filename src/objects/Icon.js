/*
 * Icon
 * ====
 *
 * Icon base class (masked sprite group)
 */

'use strict';

module.exports = Icon;

function Icon(game, x, y, mask, asset, border, width = 100.0/*, TODO: height = 100.0 ...args*/) {
  Phaser.Group.call(this, game/*, ...args*/);

  // PROPERTIES
  // - sprite
  this.sprite;
  // - maskSprite
  this.maskSprite;
  // - borderSprite
  this.borderSprite;

  this._game = game;

  var assetSprite = game.make.sprite(0,0, asset);
  assetSprite.scale.setTo(width / assetSprite.width);
  this.sprite = assetSprite;

  if (typeof mask !== 'undefined' || mask !== null) {
    this.maskSprite = game.make.sprite(0,0, mask);
    this.maskSprite.scale.setTo(width / this.maskSprite.width);

    var maskedBmd = game.make.bitmapData(this.maskSprite.width, this.maskSprite.height);
    maskedBmd.alphaMask(this.sprite, this.maskSprite);
    // replace main sprite with bitmap data mask
    this.sprite = game.make.sprite(0,0, maskedBmd);
  }

  if (typeof border !== 'undefined' || border !== null) {
    this.borderSprite = game.make.sprite(0,0, border);
    this.borderSprite.scale.setTo(width / this.borderSprite.width);
  }
}

Icon.prototype = Object.create(Phaser.Group.prototype);
Icon.prototype.constructor = Icon;

Icon.prototype.update = function () {
  // TODO: Stub.
};
