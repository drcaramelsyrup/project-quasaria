/*
 * MemoryBankWindow
 * ===============
 *
 * UI window for the memory bank
 */

'use strict';

module.exports = MemoryBankWindow;

function memoryBankButtonToggle() {
  // unresponsive while animating
  if (this._isTweening)
    return;

  this._isTweening = true;
  var timeToTween = 500;  // milliseconds

  // hide panel
  if (this.panel.visible) {
    this._game.add.tween(this.panel).to(
        {x: this._baseX + this.panelWidth}, timeToTween, Phaser.Easing.Exponential.Out, true
      ).onComplete.add(
        function () {
          this.panel.visible = false;
          this._isTweening = false;
        }, this
      );
    return;
  }

  // show panel
  this.panel.visible = true;
  this.displayItems();

  this.panel.x = this._baseX + this.panelWidth;
  this._game.add.tween(this.panel).to(
      {x: this._baseX}, timeToTween, Phaser.Easing.Exponential.Out, true
    ).onComplete.add(function () { this._isTweening = false; }, this);
}

function MemoryBankWindow(game/*, ...args*/) {
  Phaser.Group.call(this, game/*, ...args*/);

  this._game = game;

  // private members specifying margin and padding
  this._memoryTextOriginX = 95;
  this._memoryTextOriginY = 155;
  this._memoryPadding = 32;
  this._itemOriginX = 80;
  this._itemOriginY = 20;
  this._itemPadding = 40;
  this._baseX = this._memoryPadding / 2;
  this._baseY = this._memoryPadding * 2;

  // memory bank window dimensions
  this.panelHeight = game.height * 1/2 - this._memoryPadding / 2;
  this.panelWidth = game.width - this._memoryPadding;

  this._memoryTextWidth = this.panelWidth - 185;

  /**
   * Panel
   */
  
  game.slickUI.add(
    this.panel = new SlickUI.Element.DisplayObject(
      this._baseX, this._baseY, game.make.sprite(0,0, 'memory-bank'),
      this.panelWidth, this.panelHeight));
  this.panel.displayObject.width = this.panelWidth;
  this.panel.displayObject.height = this.panelHeight;

  // by default, not displayed
  this.panel.visible = false;
  this.panel.alpha = 0.8;

  /**
   * Toggle button
   */
  // until you click on the toggle button
  game.slickUI.add(
    this.toggleButton = new SlickUI.Element.DisplayObject(
      0,this._memoryPadding, game.make.button(0,0, 'memory-bank-button')));
  // set scale such that width = 1/8 panel width
  this.toggleButton.displayObject.scale.setTo(
    (this.panelWidth / 8) / this.toggleButton.displayObject.width);
  this.toggleButton.x = game.width - this._memoryPadding - this.toggleButton.displayObject.width;
  // show panel callback
  this.toggleButton.events.onInputDown.add(memoryBankButtonToggle, this);
  this.toggleButton.alpha = 0.9;

  /**
   * Text
   */
  var panelTextStyle = { font: '14px Open Sans', fill: '#48f2ff', wordWrap: true, wordWrapWidth: this._memoryTextWidth, align: 'left' };
  this.panel.add(
    this.panelText = new SlickUI.Element.DisplayObject(
      this._memoryTextOriginX,this._memoryTextOriginY, game.make.text(0,0, '', panelTextStyle)));

  // are we currently animating?
  this._isTweening = false;
}

MemoryBankWindow.prototype = Object.create(Phaser.Group.prototype);
MemoryBankWindow.prototype.constructor = MemoryBankWindow;

MemoryBankWindow.prototype.displayItems = function () {
  var inventory = this._game.player.inventory;
  // var mask = this._game.make.image('memory-bank-icon-mask');

  // Assumes InventoryItem objects in memoryBank.
  for (var i = 0; i < inventory.length; i++) {
    var inventoryItem = inventory[i];

    // var maskedBmd = this._game.make.bitmapData(mask.width, mask.height);
    // maskedBmd.alphaMask(inventoryItem.id, mask);
    // var itemSprite = this._game.make.sprite(0,0, maskedBmd);
    // itemSprite.width = itemSprite.height = this.panelWidth / 8;
    // itemSprite.scale.setTo((this.panelWidth / 8) / itemSprite.width);

    // scale = 1/8 panel width;
    var itemSprite = this._game.make.sprite(0,0, inventoryItem.id);
    itemSprite.scale.setTo((this.panelWidth / 8) / itemSprite.width);
    
    this.panel.add(new SlickUI.Element.DisplayObject(
      this._itemOriginX + i*(this._itemPadding + itemSprite.width), this._itemOriginY,
      itemSprite));

    itemSprite.inputEnabled = true;
    itemSprite.input.useHandCursor = true;
    itemSprite.events.onInputOver.add(function () {
      this.panelText.displayObject.text = this.inventoryItem.name + ': ' + this.inventoryItem.description;
    }, {panelText: this.panelText, inventoryItem: inventoryItem});
  }
};

MemoryBankWindow.prototype.update = function () {
  // TODO: Stub.
};
