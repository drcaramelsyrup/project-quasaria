/*
 * BattleUi
 * ========
 *
 * User interface for Logic Battle mechanic
 */

'use strict';

module.exports = BattleUi;

var HealthBar = require('./HealthBar.js');
var Icon = require('./Icon');
var items = require('../../static/assets/items.json');
var textstyles = require('../../static/assets/textstyles.json');

function BattleUi(game, playerDeck, enemyDeck/*, ...args*/) {
  Phaser.Group.call(this, game/*, ...args*/);

  // - this.cardSignal
  // - this.cardAnimCompleteSignal
  // - this.argAnimCompleteSignal
  // - this.playerDeckIcons
  // - this.enemyDeckIcons
  // - this.credBar

  /** Signals */
  this.cardSignal = new Phaser.Signal();
  this.cardAnimCompleteSignal = new Phaser.Signal();
  this.argAnimCompleteSignal = new Phaser.Signal();

  this.playerDeckIcons = [];
  this.enemyDeckIcons = [];

  /** Private properties */
  this._game = game;
  this._portraitSize = 100;
  this._cardSize = 70;
  this._credSize = 85;
  this._enemyOriginY = game.height * 0.3;
  this._centerX = game.width / 2;
  this._argumentRadius = this._portraitSize;

  /** Background + overlay (this._background, this._overlay) */
  var roomBg = game.make.sprite(0,0, game.room.area.id);
  game.add.existing(roomBg);

  this._background = game.add.sprite(0,0,'battle-background');
  this._background.width = game.width;
  this._background.height = game.height;
  this._background.alpha = 0.85;

  this._overlay = game.add.sprite(0,0,'battle-overlay');
  this._overlay.width = game.width;
  this._overlay.height = game.height;
  // hide overlay initially
  this._overlay.alpha = 0;

  /** Enemy display */
  var enemyBarConfig = {x: this._centerX, y: 50, height:20, width:150, flipped:true};
  this.persuadeBar = new HealthBar(game, enemyBarConfig);
  var enemyIcon = game.add.existing(new Icon(game,
    this._centerX - this._portraitSize/2, this._enemyOriginY - this._portraitSize/2,
    'gleaming-shoal-portrait', null, null, this._portraitSize));
  enemyIcon.alpha = 1;

  /** Enemy deck display */
  for (var i = 0; i < enemyDeck.length; i++) {

    var argIcon = game.add.existing(new Icon(game, 0,0,
      'question-mark', 'memory-bank-icon-mask', 'memory-bank-icon', this._cardSize));
    argIcon.borderSprite.tint = 0xff00ff;

    this.enemyDeckIcons.push({'id': enemyDeck[i].assetName, 'icon': argIcon});

  }
  this.positionArguments(game, false);

  /* Current argument position marker */
  var currentArgMarker = game.add.sprite(0, 0, 'memory-bank-icon');
  currentArgMarker.scale.setTo(this._cardSize * 1.2 / currentArgMarker.width);
  currentArgMarker.anchor.setTo(0.5, 0.5);

  currentArgMarker.x = this._centerX;
  currentArgMarker.y = this._enemyOriginY + this._argumentRadius;

  /** Player display */
  this.credIcon = new SlickUI.Element.DisplayObject(
    this._centerX - this._credSize/2, game.height * 5 / 8 - this._credSize / 2,
    new Icon(game, 0,0,
    'memory-bank-icon-mask', null, 'memory-bank-icon', this._credSize));
  game.slickUI.add(this.credIcon);

  this.credIcon.add(
    this.credText = new SlickUI.Element.DisplayObject(0, 0,
      game.make.text(0, 0, ''+this._game.cred, textstyles['credibility']))
  );
  this.credText.displayObject.setTextBounds(0, 0, this._credSize, this.credIcon.displayObject.height);

  /** Player deck display */
  var deckOriginX = game.width * 3 / 5;
  var deckOriginY = this.credIcon.y + (this._credSize - this._cardSize) / 2;

  for (i = 0; i < playerDeck.length; i++) {
    var playerCardIcon = game.add.existing(new Icon(game, 0,0,
      playerDeck[i].assetName, 'memory-bank-icon-mask', 'memory-bank-icon', this._cardSize));
    playerCardIcon.x = deckOriginX + i*(this._cardSize);
    playerCardIcon.y = deckOriginY;

    var cardSignal = this.cardSignal;
    // send signal upon click and delete tooltip
    playerCardIcon.events.onInputDown.add(function () {
      cardSignal.dispatch(this.game, this.currentCard);
    }, {game: game, currentCard: playerDeck[i]});

    playerCardIcon.inputEnabled = true;
    playerCardIcon.input.useHandCursor = true;

    this.playerDeckIcons.push(playerCardIcon);
    this.addTooltip(i,
      this._centerX + this._argumentRadius, this._enemyOriginY - this._argumentRadius);
  }

  /** Persuasion meter */

}

BattleUi.prototype = Object.create(Phaser.Group.prototype);
BattleUi.prototype.constructor = BattleUi;

BattleUi.prototype.update = function () {
  // TODO: Stub.
};

BattleUi.prototype.getArgIcon = function (argument) {
  for (var i = 0; i < this.enemyDeckIcons.length; i++) {
    var argIconWithIdx = this.enemyDeckIcons[i];
    if (argument.assetName === argIconWithIdx['id']) {
      return {'index': i, 'id': argIconWithIdx['id'], 'icon': argIconWithIdx['icon']};
    }
  }
  return {'index': -1, 'icon': null};
};

BattleUi.prototype.revealCurrent = function () {
  var currentIconWithId = this.enemyDeckIcons[0];
  currentIconWithId['icon'] = this.revealArgIcon(
    currentIconWithId['id'], currentIconWithId['icon']);
};

BattleUi.prototype.revealArgIcon = function (id, argIcon) {
  var trash = argIcon;
  var newIcon = this._game.add.existing(new Icon(this._game, 0,0,
    id, 'memory-bank-icon-mask', 'memory-bank-icon', this._cardSize));
  newIcon.x = argIcon.x;
  newIcon.y = argIcon.y;
  this._game.world.swap(argIcon, newIcon);  // swap display ordering
  newIcon.borderSprite.tint = 0xff00ff;
  trash.destroy();
  return newIcon;
};

BattleUi.prototype.getCardIcon = function (card) {
  for (var i = 0; i < this.playerDeckIcons.length; i++) {
    var cardIcon = this.playerDeckIcons[i];
    if (card.key === cardIcon.id) {
      return {'index': i, 'icon': cardIcon};
    }
  }
  return {'index': -1, 'icon': null};
};

BattleUi.prototype.startCorrectCardTween = function (cardIcon, cardIdx, targetedArg) {
  //this sounds best when it starts at click
  this._game.sound.play('correct-card');
  var tween = this._game.add.tween(cardIcon);
  tween.to(
    { x: targetedArg.x, y: targetedArg.y }, 1000,
    Phaser.Easing.Exponential.In, true, 0);

  // create fill sprite

  var shatterSprite = this._game.make.sprite(
    targetedArg.x + targetedArg.width/2,
    targetedArg.y + targetedArg.height/2, 'memory-bank-icon-fill');
  shatterSprite.alpha = 0;
  // add slight fudge factor
  shatterSprite.scale.setTo(this._cardSize*1.05 / shatterSprite.width);
  shatterSprite.anchor.setTo(0.5, 0.5);
  this._game.add.existing(shatterSprite);
  var alphaTween = this._game.add.tween(shatterSprite);

  // start alpha tween after
  tween.onComplete.add(function () {
    alphaTween.to({ alpha: 1 }, 1000, Phaser.Easing.Exponential.In, true, 0);
    alphaTween.onComplete.add(function () {
      cardIcon.destroy();
      targetedArg.destroy();
      shatterSprite.destroy();
      // arguments update by themselves, player cards do not
      this.playerDeckIcons.splice(cardIdx, 1);
    }, this);
  }, this);

  // return the last tween in the chain
  return alphaTween;
};

BattleUi.prototype.startIncorrectCardTween = function (cardIcon, targetedArg) {
  var tween = this._game.add.tween(cardIcon);
  var originX = cardIcon.x;
  var originY = cardIcon.y;

  tween.to({ x: targetedArg.x, y: targetedArg.y }, 1000,
    Phaser.Easing.Exponential.InOut, false, 0);
  // add an additional tween to return to original position
  tween.onComplete.add(function () {
    this._game.sound.play('wrong-card');

  }, this);

  var lastTween = this._game.add.tween(cardIcon);
  lastTween.to({ x: originX, y: originY }, 1000,
    Phaser.Easing.Exponential.In, false, 0);

  tween.chain(lastTween).start();

  // return last tween in the chain
  return lastTween;
};

BattleUi.prototype.playCardAnimation = function (card, argument, isCorrect) {
  // find matching argument icon
  var targetedArg = undefined;
  for (var i = 0; i < this.enemyDeckIcons.length; i++) {
    var argIconId = this.enemyDeckIcons[i]['id'];
    if (argument.assetName === argIconId) {
      targetedArg = this.enemyDeckIcons[i]['icon'];
      break;
    }
  }
  if (typeof targetedArg === 'undefined')
    return;

  // find matching card icon
  for (i = 0; i < this.playerDeckIcons.length; i++) {
    var cardIcon = this.playerDeckIcons[i];
    if (card.key === cardIcon.id) {
      var lastTween;
      // play different animations on correct vs. incorrect card
      if (isCorrect) {
        lastTween = this.startCorrectCardTween(cardIcon, i, targetedArg);
      } else {
        lastTween = this.startIncorrectCardTween(cardIcon, targetedArg);
      }
      lastTween.onComplete.add(function () {
        this.cardAnimCompleteSignal.dispatch(this._game);

      }, this);
      return;
    }
  }
};

BattleUi.prototype.updateArguments = function (args, currentArgIdx) {
  var newEnemyDeckIcons = [];

  for (var i = 0; i < args.length; i++) {
    var idx = currentArgIdx + i;
    if (idx >= args.length)
      idx -= args.length;

    // null argument
    if (typeof args[idx] === 'undefined' || args[idx] === null)
      continue;

    var argIconWithId = this.getArgIcon(args[idx]);
    // not found
    if (argIconWithId['index'] === -1) {
      // add a new argument icon
      argIconWithId['id'] = args[idx]['id'];
      argIconWithId['icon'] = this._game.add.existing(new Icon(this._game, 0,0,
        'question-mark', 'memory-bank-icon-mask', 'memory-bank-icon', this._cardSize));
      argIconWithId['icon'].borderSprite.tint = 0xff00ff;
    }
    newEnemyDeckIcons.push({
      'id': argIconWithId['id'], 
      'icon': argIconWithId['icon']
    });
  }

  this.enemyDeckIcons = newEnemyDeckIcons;
};

BattleUi.prototype.positionArguments = function (game, isTweening = true) {
  var nArgs = this.enemyDeckIcons.length;
  var argIcon;

  if (!isTweening) {
    for (var i = 0; i < nArgs; i++) {
      argIcon = this.enemyDeckIcons[i]['icon'];
      argIcon.x = this._centerX + Math.sin(i / nArgs * 2*Math.PI) * this._argumentRadius - this._cardSize / 2;
      argIcon.y = this._enemyOriginY + Math.cos(i / nArgs * 2*Math.PI) * this._argumentRadius - this._cardSize / 2;
    }
    return;
  }

  var tweeningPositions = [];
  var tweens = [];
  for (var j = 0; j < nArgs; j++) {
    tweeningPositions.push(
      new Phaser.Point(
        this._centerX + Math.sin(j / nArgs * 2*Math.PI) * this._argumentRadius - this._cardSize / 2,
        this._enemyOriginY + Math.cos(j / nArgs * 2*Math.PI) * this._argumentRadius - this._cardSize / 2));
  }
  for (j = 0; j < nArgs; j++) {
    argIcon = this.enemyDeckIcons[j]['icon'];
    if (typeof argIcon === 'undefined' || argIcon === null)
      continue;
    tweens.push(game.add.tween(argIcon).to(
      { x: tweeningPositions[j].x, y: tweeningPositions[j].y},
      1000, Phaser.Easing.Quadratic.InOut, false, 0));
  }
  for (j = 0; j < tweens.length; j++) {
    // Notify completion of argument rotation
    if (j === 0) {
      tweens[j].onComplete.add(function () {
        this.revealCurrent();
        this.argAnimCompleteSignal.dispatch(this._game);
      }, this);
    }
    tweens[j].start();
  }
};

BattleUi.prototype.battleStart = function () {
  this.cardsInputEnabled(true);
  this.revealCurrent();
};

BattleUi.prototype.introTweens = function () {
  var tweenTime = 500;
  this.tweenInOverlay(tweenTime);
  return this.tweenInBackgroundTint(tweenTime);
};

BattleUi.prototype.tweenInOverlay = function (tweenTime) {
  var tween = this._game.add.tween(this._overlay);
  tween.to( {alpha: 1}, tweenTime, Phaser.Easing.Exponential.In, true, 0);
  return tween;
};

BattleUi.prototype.tweenInBackgroundTint = function (tweenTime) {
  var tween = this._game.add.tween(this._background);
  tween.to( {tint: 0x33343a}, tweenTime, Phaser.Easing.Exponential.In, true, 0);
  return tween;
};

BattleUi.prototype.flickerOverlay = function () {
  var tween = this._game.add.tween(this._overlay);
  var timeLeft = 500; // half a second total
  var flickerTime = 10;
  var nFlickers = this._game.rnd.integerInRange(2,4);
  var defaultTint = this._overlay.tint;
  var tintColor = 0x333535;
  var firstTween = tween;

  for (var i = 0; i < nFlickers; i++) {
    // use up all remaining time if it is the last flicker
    var randTime = i == nFlickers - 1
      ? timeLeft
      : this._game.rnd.frac() * timeLeft;

    // flicker instantly if it's the first flicker
    var splitTime = i == 0 ? 0 : this._game.rnd.frac() * randTime;
    tween.to( { tint: tintColor }, flickerTime, Phaser.Easing.Linear.In, false, splitTime);

    var nextTween = this._game.add.tween(this._overlay);
    nextTween.to( { tint: defaultTint }, flickerTime, Phaser.Easing.Linear.In, false, randTime - splitTime);
    tween.chain(nextTween);

    tween = nextTween;
    timeLeft -= randTime;
  }
  firstTween.start();
};

BattleUi.prototype.updateCredBar = function (value, isDamage) {
  // damage indication
  if (isDamage) {
    this.flickerOverlay();
  }
  this.credText.displayObject.text = value;
  var originalTint = this.credText.displayObject.tint;
  var firstTween = this._game.add.tween(this.credText.displayObject);
  firstTween.to({ tint: 0x970B26 }, 100, Phaser.Easing.Linear.In, false, 0);
  var secondTween = this._game.add.tween(this.credText.displayObject);
  secondTween.to({ tint: originalTint }, 500, Phaser.Easing.Linear.In, false, 0);
  firstTween.chain(secondTween);
  firstTween.start();
};

BattleUi.prototype.updatePersuasionBar = function () {
  this.persuadeBar.setPercent(this._game.persuasion * 25);
};

BattleUi.prototype.cardsInputEnabled = function (isEnabled) {
  for (var i = 0; i < this.playerDeckIcons.length; i++) {
    this.playerDeckIcons[i].inputEnabled = isEnabled;
  }
};

BattleUi.prototype.addTooltip = function (cardIdx, x, y) {
  var playerCardIcon = this.playerDeckIcons[cardIdx];

  var tooltip = function () {
    var tooltipWidth = 250;
    var tooltipHeight = 250;

    var bmd = this._game.add.bitmapData(tooltipWidth, tooltipHeight);
    bmd.ctx.beginPath();
    bmd.ctx.rect(0, 0, tooltipWidth, tooltipHeight);
    bmd.ctx.fillStyle = '#424d4f';
    bmd.ctx.fill();

    this._game.slickUI.add(this.tooltip = new SlickUI.Element.DisplayObject(
      x,y, this._game.make.sprite(0, 0, bmd)));
    this.tooltip.alpha = 0.8;

    var nameTextStyle = { font: '14px Goudy Bookletter 1911', fill: '#48f2ff', wordWrap: true, wordWrapWidth: tooltipWidth, fontWeight: 'bold', boundsAlignH: 'center' };
    var nameText = new SlickUI.Element.DisplayObject(0,0,
      this._game.make.text(0,0, items[playerCardIcon.id]['name'].toUpperCase(), nameTextStyle));
    this.tooltip.add(nameText);
    // for alignment purposes
    var nameTextHeight = nameText.displayObject.getBounds().height;
    nameText.displayObject.setTextBounds(0,0, tooltipWidth, tooltipHeight);

    var descTextStyle = { font: '14px Open Sans', fill: '#48f2ff', wordWrap: true, wordWrapWidth: tooltipWidth, align: 'left' };
    var descText = new SlickUI.Element.DisplayObject(
      0, Math.round(nameTextHeight),
      this._game.make.text(0,0, items[playerCardIcon.id]['desc'], descTextStyle));
    this.tooltip.add(descText);
  };

  var deleteTooltip = function () {
    if (this.tooltip) {
      this.tooltip.container.displayGroup.removeAll();
    }
    this.tooltip = undefined;
  };

  playerCardIcon.events.onInputDown.add(deleteTooltip, playerCardIcon);

  // tooltip functions
  playerCardIcon.events.onInputOver.add(tooltip, playerCardIcon);
  playerCardIcon.events.onInputOut.add(deleteTooltip, playerCardIcon);

};
