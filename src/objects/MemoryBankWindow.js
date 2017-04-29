/*
 * MemoryBankWindow
 * ===============
 *
 * UI window for the memory bank
 */

'use strict';

var items = require('../../static/assets/items.json');

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
        {x: this._baseX + this.panelWidth + this._memoryPadding}, timeToTween, Phaser.Easing.Exponential.Out, true
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
  this.display();

  this.panel.x = this._baseX + this.panelWidth + this._memoryPadding;
  this._game.add.tween(this.panel).to(
      {x: this._baseX}, timeToTween, Phaser.Easing.Exponential.Out, true
    ).onComplete.add(function () { this._isTweening = false; }, this);
}

function MemoryBankWindow(game/*, ...args*/) {
  Phaser.Group.call(this, game/*, ...args*/);

  this._game = game;

  // private members specifying margin and padding
  this._memoryTextOriginX = 100;
  this._memoryTextOriginY = 155;
  this._memoryPadding = 32;
  this._itemOriginX = 80;
  this._itemOriginY = 25;
  this._baseX = this._memoryPadding / 2;
  this._baseY = this._memoryPadding * 2;

  // memory bank window dimensions
  this.panelHeight = game.height * 1/2 - this._memoryPadding / 2;
  this.panelWidth = game.width - this._memoryPadding;
  this._rowCapacity = 5;  // items per row
  this._itemStart = 0;  // determines which row to show

  // window-dependent private member dimensions
  this._memoryTextWidth = this.panelWidth - 185;
  this._itemPadding = this.panelWidth / 50;
  this._nextOriginX = this.panelWidth - 55;
  this._nextOriginY = 0;
  this._prevOriginX = -18;
  this._prevOriginY = 0;

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
   * Text - name and description
   */
  var nameTextStyle = { font: '14px Goudy Bookletter 1911', fill: '#48f2ff', wordWrap: true, wordWrapWidth: this._memoryTextWidth, fontWeight: 'bold', boundsAlignH: 'center' };
  this.panel.add(
    this.nameText = new SlickUI.Element.DisplayObject(
      this._memoryTextOriginX,
      this._memoryTextOriginY, 
      game.make.text(0,0, '', nameTextStyle), this._memoryTextWidth));
  // for alignment purposes
  var nameTextHeight = this.nameText.displayObject.getBounds().height;
  this.nameText.displayObject.setTextBounds(0,0, this._memoryTextWidth, nameTextHeight);

  var descTextStyle = { font: '14px Open Sans', fill: '#48f2ff', wordWrap: true, wordWrapWidth: this._memoryTextWidth, align: 'left' };
  this.panel.add(
    this.descText = new SlickUI.Element.DisplayObject(
      this._memoryTextOriginX,
      this._memoryTextOriginY + nameTextHeight, 
      game.make.text(0,0, '', descTextStyle), this._memoryTextWidth));

  /**
   * Bookkeeping
   */
  // are we currently animating?
  this._isTweening = false;
  this._itemDisplayObjects = []; // for deletion purposes
  this._navButtons = [];
}

MemoryBankWindow.prototype = Object.create(Phaser.Group.prototype);
MemoryBankWindow.prototype.constructor = MemoryBankWindow;

MemoryBankWindow.prototype.display = function () {
  this.cleanWindow();
  this.displayItems();
  this.showNavButtons();
};

MemoryBankWindow.prototype.cleanWindow = function () {
  for (var i = 0; i < this._itemDisplayObjects.length; i++) {
    var item = this._itemDisplayObjects[i];
    item.container.displayGroup.removeAll(true);
    item.container.displayGroup.destroy();
  }
  for (i = 0; i < this._navButtons.length; i++) {
    var navButton = this._navButtons[i];
    navButton.container.displayGroup.removeAll(true);
    navButton.container.displayGroup.destroy();
  }
  this._itemDisplayObjects = [];
  this._navButtons = [];
};

MemoryBankWindow.prototype.displayItems = function () {
  var inventory = this._game.player.inventory;

  var itemEnd = this._itemStart + this._rowCapacity < inventory.length 
    ? this._itemStart + this._rowCapacity 
    : inventory.length;

  // Assumes InventoryItem objects in inventory.
  for (var i = this._itemStart; i < itemEnd; i++) {
    var itemId = inventory[i];

    // scaled width = 1/7 panel width;
    var desiredWidth = (this.panelWidth / 7);
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

    this._itemDisplayObjects.push(slickItem);
    this._itemDisplayObjects.push(slickBorder);
  }
};

MemoryBankWindow.prototype.showNavButtons = function () {
  // next buttons
  if (this._itemStart + this._rowCapacity < this._game.player.inventory.length) {
    var nextButton = this._game.make.button(0,0,'memory-bank-next');
    var slickNext;
    this.panel.add(slickNext = new SlickUI.Element.DisplayObject(
      this._nextOriginX, this._nextOriginY, nextButton));
    // scaled by height, equal to panel height
    nextButton.scale.setTo(this.panelHeight / nextButton.height);
    this._navButtons.push(slickNext);

    nextButton.events.onInputUp.add(function () {
      this.switchRow(true);
      this.display();
    }, this);

  }

  // prev buttons
  if (this._itemStart > 0) {
    var prevButton = this._game.make.button(0,0,'memory-bank-next');
    // rotate sprite
    prevButton.anchor.setTo(0.5, 0.5);
    prevButton.scale.y *= -1;
    prevButton.anchor.setTo(1,1);

    var slickPrev;
    this.panel.add(slickPrev = new SlickUI.Element.DisplayObject(
      this._prevOriginX, this._prevOriginY, 
      prevButton));
    this._navButtons.push(slickPrev);

    prevButton.scale.setTo(this.panelHeight / prevButton.height);

    prevButton.events.onInputUp.add(function () {
      this.switchRow(false);
      this.display();
    }, this);

  }
};

MemoryBankWindow.prototype.switchRow = function (wantsNextRow) {
  var inventory = this._game.player.inventory;
  if (wantsNextRow && this._itemStart + this._rowCapacity < inventory.length) {
    this._itemStart += this._rowCapacity;
    return;
  }
  if (!wantsNextRow && this._itemStart - this._rowCapacity >= 0) {
    this._itemStart -= this._rowCapacity;
    return;
  }
};

MemoryBankWindow.prototype.update = function () {
  // TODO: Stub.
};
