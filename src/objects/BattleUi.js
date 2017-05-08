/*
 * BattleUi
 * ========
 *
 * User interface for Logic Battle mechanic
 */

'use strict';

module.exports = BattleUi;

var HealthBar = require('../objects/HealthBar.js');
var Card = require('../objects/Card');
var Argument = require('../objects/Argument');

function BattleUi(game/*, ...args*/) {
  Phaser.Group.call(this, game/*, ...args*/);

  // TODO:
  //   1. Edit constructor parameters accordingly.
  //   2. Adjust object properties.

  this._game = game;
  this._portraitSize = 100;
  this._enemyOriginY = game.height / 4;
  this._centerX = game.width / 2;

  /** Background */
  var background = game.add.sprite(0,0,'battle-background');
  background.width = game.width;
  background.height = game.height;

  /** Enemy display */
  var enemySprite = game.add.sprite(this._centerX, this._enemyOriginY, 'goblin-head');
  enemySprite.anchor.setTo(0.5, 0.5);
  enemySprite.width = enemySprite.height = this._portraitSize;

  /** Enemy deck display */
  var argumentRadius = this._portraitSize;
  var enemyDeck = [];
  enemyDeck.push(game.add.existing(new Argument(game, 0,0, 'lunar-module', 'greek-sphinx')));
  enemyDeck.push(game.add.existing(new Argument(game, 0,0, 'fencer', 'cyborg-face')));

  for (var i = 0; i < enemyDeck.length; i++) {
    var nArgs = enemyDeck.length;
    enemyDeck[i].x = this._centerX + Math.sin(i / nArgs * 2*Math.PI) * argumentRadius;
    enemyDeck[i].y = this._enemyOriginY + Math.cos(i / nArgs * 2*Math.PI) * argumentRadius;
  }

  /** Player display */
  var barConfig = {x: this._centerX, y: this._enemyOriginY + this._portraitSize * 1.5, height:20, width:150};
  var credBar = new HealthBar(game, barConfig);
  var playerSprite = game.add.sprite(this._centerX, credBar.y + this._portraitSize/2, 'alien-stare');
  playerSprite.anchor.setTo(0.5, 0.5);
  playerSprite.width = playerSprite.height = this._portraitSize;

  /** Player deck display */
  var deckOriginX = game.width * 3 / 4;
  var deckOriginY = playerSprite.y;
  game.add.existing(new Card(game, deckOriginX, deckOriginY, 'greek-sphinx'));

  /** Persuasion meter */

  // //adding in player cards and face --to do: fetch these from inventory/player skills;
  // game.add.sprite(100, game.world.height - 125, 'alien-stare');
  // playerDeck.push(game.add.existing(new Card(game, 400, 470, 'greek-sphinx')));
  // playerDeck.push(game.add.existing(new Card(game, 480, 470, 'cyborg-face')));
  // playerDeck.push(game.add.existing(new Card(game, 560, 470, 'curly-mask')));
  // playerDeck.forEach(function (card) {
  //   card.events.onInputDown.add(cardAction, card);
  //   card.events.onInputOver.add(tooltip, card);
  //   card.events.onInputOut.add(deleteTooltip, card);
  // });
  // //adding in credibility/health bar
  // var barConfig = {x:160, y:game.world.height - 150, height:20, width:150};
  // credBar = new HealthBar(game, barConfig);
  // //adding opponent face and opponent cards --to do: fetch these from main game state
  // opponentDeck.push(game.add.existing(new Argument(game, 130, game.world.centerY - 50, 'lunar-module', 'greek-sphinx')));
  // opponentDeck.push(game.add.existing(new Argument(game, 245, game.world.centerY - 135, 'fencer', 'cyborg-face')));


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
