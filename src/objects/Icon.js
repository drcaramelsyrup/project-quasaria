/*
 * Icon
 * ====
 *
 * Icon base class (masked sprite group)
 */

'use strict';

module.exports = Icon;

function Icon(game, x, y, asset, mask, border, width = 100.0/*, TODO: height = 100.0 ...args*/) {
  Phaser.Sprite.call(this, game, x, y, asset/*, ...args*/);

  // PROPERTIES
  // - maskSprite
  this.maskSprite;
  // - borderSprite
  this.borderSprite;
  // - asset key
  this.id = asset;

  this._game = game;
  // expands borders of mask slightly
  var scaleRelax = 1.05;

  if (typeof mask !== 'undefined' && mask !== null) {
    this.maskSprite = game.make.sprite(x,y, mask);

    this.maskSprite.scale.setTo(this.width*scaleRelax / this.maskSprite.width);

    var maskedBmd = game.make.bitmapData(this.maskSprite.width, this.maskSprite.height);
    maskedBmd.alphaMask(this, this.maskSprite);
    // replace main sprite with bitmap data mask
    this.loadTexture(maskedBmd);
  }

  this.scale.setTo(width / this.width);
  var parentScale = this.scale.x;

  if (typeof border !== 'undefined' && border !== null) {
    this.borderSprite = game.make.sprite(0,0, border);
    this.addChild(this.borderSprite);
    this.borderSprite.scale.setTo((width / this.borderSprite.width) / parentScale);
  }

}

Icon.prototype = Object.create(Phaser.Sprite.prototype);
Icon.prototype.constructor = Icon;

Icon.prototype.update = function () {
  var i = this.children.length;
  while (i--) {
    this.getChildAt(i).update();
  }
};
