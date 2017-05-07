/*
 * BattleUi
 * ========
 *
 * User interface for Logic Battle mechanic
 */

'use strict';

module.exports = BattleUi;

function BattleUi(game/*, ...args*/) {
  Phaser.Group.call(this, game/*, ...args*/);

  // TODO:
  //   1. Edit constructor parameters accordingly.
  //   2. Adjust object properties.

  this._game = game;

  /** Background */
  var background = game.add.sprite(0,0,'battle-background');
  background.width = game.width;
  background.height = game.height;

  /* 

  var assetSprite = this._game.make.sprite(0,0, itemId);
    assetSprite.scale.setTo(desiredWidth / assetSprite.width);

    var maskSprite = this._game.make.sprite(0,0, 'memory-bank-icon-mask');
    maskSprite.scale.setTo(desiredWidth / maskSprite.width);
    
    var maskedBmd = this._game.make.bitmapData(maskSprite.width, maskSprite.height);
    maskedBmd.alphaMask(assetSprite, maskSprite);

    var itemSprite = this._game.make.sprite(0,0, maskedBmd);
    var slickItem;
    this.panel.add(slickItem = new SlickUI.Element.DisplayObject(
      this._itemOriginX + (i - this._itemStart)*(this._itemPadding + itemSprite.width), this._itemOriginY,
      itemSprite));

    var borderSprite = this._game.make.sprite(0,0, 'memory-bank-icon');
    borderSprite.scale.setTo(desiredWidth / borderSprite.width);
    var slickBorder;
    this.panel.add(slickBorder = new SlickUI.Element.DisplayObject(
      this._itemOriginX + (i - this._itemStart)*(this._itemPadding + itemSprite.width), this._itemOriginY,
      borderSprite));

    itemSprite.inputEnabled = true;
    itemSprite.input.useHandCursor = true;
    itemSprite.events.onInputOver.add(function () {
      this.nameText.displayObject.text = items[this.itemId]['name'].toUpperCase();
      this.descText.displayObject.text = items[this.itemId]['desc'];
    }, {nameText: this.nameText, descText: this.descText, itemId: itemId});
*/
}
BattleUi.prototype = Object.create(Phaser.Group.prototype);
BattleUi.prototype.constructor = BattleUi;

BattleUi.prototype.update = function () {
  // TODO: Stub.
};
