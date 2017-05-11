/*
 * BattleUi
 * ========
 *
 * User interface for Logic Battle mechanic
 */

'use strict';

module.exports = BattleUi;

var HealthBar = require('./HealthBar.js');
var Card = require('./Card');
var Argument = require('./Argument');
var Icon = require('./Icon');

function BattleUi(game, playerDeck, enemyDeck/*, ...args*/) {
  Phaser.Group.call(this, game/*, ...args*/);

  // - this.cardSignal
  // - this.playerDeckIcons
  // - this.enemyDeckIcons

  /** Signals */
  this.cardSignal = new Phaser.Signal();
  this.playerDeckIcons = [];
  this.enemyDeckIcons = [];

  /** Private properties */
  this._game = game;
  this._portraitSize = 100;
  this._cardSize = 70;
  this._enemyOriginY = game.height / 4;
  this._centerX = game.width / 2;

  /** Background */
  var background = game.add.sprite(0,0,'battle-background');
  background.width = game.width;
  background.height = game.height;

  /** Enemy display */
  var enemyIcon = game.add.existing(new Icon(game,
    this._centerX - this._portraitSize/2, this._enemyOriginY - this._portraitSize/2, 
    'gleaming-shoal-portrait', null, null, this._portraitSize));
  // enemySprite.anchor.setTo(0.5, 0.5);
  // enemySprite.width = enemySprite.height = this._portraitSize;

  /** Enemy deck display */
  var argumentRadius = this._portraitSize;

  for (var i = 0; i < enemyDeck.length; i++) {
    var argIcon = game.add.existing(new Icon(game, 0,0, 
      enemyDeck[i].assetName, 'memory-bank-icon-mask', 'memory-bank-icon', this._cardSize));
    var nArgs = enemyDeck.length;
    argIcon.x = this._centerX + Math.sin(i / nArgs * 2*Math.PI) * argumentRadius - this._cardSize / 2;
    argIcon.y = this._enemyOriginY + Math.cos(i / nArgs * 2*Math.PI) * argumentRadius - this._cardSize / 2;

    this.enemyDeckIcons.push(argIcon);
  }

  /** Player display */
  var barConfig = {x: this._centerX, y: this._enemyOriginY + this._portraitSize * 1.5, height:20, width:150};
  var credBar = new HealthBar(game, barConfig);
  var playerSprite = game.add.sprite(this._centerX, credBar.y + this._portraitSize/2, 'alien-stare');
  playerSprite.anchor.setTo(0.5, 0.5);
  playerSprite.width = playerSprite.height = this._portraitSize;

  /** Player deck display */
  var deckOriginX = game.width * 3 / 5;
  var deckOriginY = playerSprite.y;

  for (i = 0; i < playerDeck.length; i++) {
    var playerCardIcon = game.add.existing(new Icon(game, 0,0, 
      playerDeck[i].assetName, 'memory-bank-icon-mask', 'memory-bank-icon', this._cardSize));
    playerCardIcon.x = deckOriginX + i*(this._cardSize);
    playerCardIcon.y = deckOriginY;

    var cardSignal = this.cardSignal;
    var currentCard = playerDeck[i];
    playerCardIcon.events.onInputDown.add(function () {
      cardSignal.dispatch(this.game, this.currentCard);

      // var tween = game.add.tween(playerCardIcon);
      // tween.to({ x: 125, y: game.world.height - 250 }, 1000, 'Linear', true, 0);
      // // send signal
      // tween.onComplete.add(function () {
      // });
    }, {game: game, currentCard: playerDeck[i]});

    playerCardIcon.inputEnabled = true;
    playerCardIcon.input.useHandCursor = true;

    // tooltip functions
    playerCardIcon.events.onInputOver.add(function () {
      game.slickUI.add(this.tooltip = new SlickUI.Element.Panel(this.x - 10, this.y - 60, 100, 50));
      this.tooltip.add(new SlickUI.Element.Text(0,0, 'test')).center();
    }, playerCardIcon);

    playerCardIcon.events.onInputOut.add(function () {
      if (this.tooltip) {
        this.tooltip.destroy();
      }
      this.tooltip = undefined;
    }, playerCardIcon);

    this.playerDeckIcons.push(playerCardIcon);

  }

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

function tooltip(game) {
  game.slickUI.add(this.tooltip = new SlickUI.Element.Panel(this.x - 10, this.y - 60, 100, 50));
  this.tooltip.add(new SlickUI.Element.Text(0,0, 'test')).center();
}

function deleteTooltip() {
  if (this.tooltip) {
    this.tooltip.destroy();
  }
  this.tooltip = undefined;
}

BattleUi.prototype = Object.create(Phaser.Group.prototype);
BattleUi.prototype.constructor = BattleUi;

BattleUi.prototype.update = function () {
  // TODO: Stub.
};

BattleUi.prototype.playCardAnimation = function (card, argument) {
  // find correct argument
  var targetedArg = undefined;
  for (var i = 0; i < this.enemyDeckIcons.length; i++) {
    var argIcon = this.enemyDeckIcons[i];
    if (argument.assetName === argIcon.id) {
      targetedArg = argIcon;
      break;
    }
  }
  if (typeof targetedArg === 'undefined')
    return;

  // find correct card
  for (i = 0; i < this.playerDeckIcons.length; i++) {
    var cardIcon = this.playerDeckIcons[i];
    if (card.key === cardIcon.id) {
      var tween = this._game.add.tween(cardIcon);
      tween.to(
        {x: targetedArg.x, y: targetedArg.y}, 1000, 
        Phaser.Easing.Exponential.In, true, 0);
      return;
    }
  }
};
