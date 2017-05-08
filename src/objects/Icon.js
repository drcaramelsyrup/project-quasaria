/*
 * Icon
 * ====
 *
 * Icon base class (masked sprite group)
 */

'use strict';

module.exports = Icon;

function Icon(game, x, y, mask, asset, border, width = 100.0/*, TODO: height = 100.0 ...args*/) {
  Phaser.Sprite.call(this, game, x, y, asset/*, ...args*/);

  // PROPERTIES
  // - asset
  this.main;
  // - maskSprite
  this.maskSprite;
  // - borderSprite
  this.borderSprite;

  this._game = game;

  this.scale.setTo(width / this.width);

  if (typeof mask !== 'undefined' || mask !== null) {
    this.maskSprite = game.make.sprite(0,0, mask);
    this.maskSprite.scale.setTo(width / this.maskSprite.width);

    var maskedBmd = game.make.bitmapData(this.maskSprite.width, this.maskSprite.height);
    maskedBmd.alphaMask(this, this.maskSprite);
    // replace main sprite with bitmap data mask
    this.loadTexture(maskedBmd);
  }

  if (typeof border !== 'undefined' || border !== null) {
    this.borderSprite = game.make.sprite(0,0, border);
    this.borderSprite.scale.setTo(width / this.borderSprite.width);

    this.addChild(this.borderSprite);
  }

}

Icon.prototype = Object.create(Phaser.Sprite.prototype);
Icon.prototype.constructor = Icon;

Icon.prototype.update = function () {
  // TODO: Stub.
};
