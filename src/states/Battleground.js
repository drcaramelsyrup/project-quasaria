'use strict';

var Card = require('../objects/Card');
var Argument = require('../objects/Argument');
var HealthBar = require('../objects/HealthBar.js');
<<<<<<< HEAD
var items = require('../../static/assets/items.json');

=======
var BattleUi = require('../objects/BattleUi.js');
>>>>>>> Relocate assets, fix linting errors. Basic Battle background.

var playerTurn = true;
var currentArgument = 0;
var opponentDeck = [];
var panel;
var credBar;
var cred = 4;

exports.preload = function(game) {
  // preload all UI menu themes.
  game.slickUI.load('ui/kenney-theme/kenney.json');
};

exports.create = function (game) {
  game.battleUi = new BattleUi(game);
  //adding in player cards and face --to do: fetch these from inventory/player skills;
  game.add.sprite(100, game.world.height - 125, 'alien-stare');
  var playerDeck = [];
  playerDeck.push(game.add.existing(new Card(game, 400, 470, 'greek-sphinx')));
  playerDeck.push(game.add.existing(new Card(game, 480, 470, 'cyborg-face')));
  playerDeck.push(game.add.existing(new Card(game, 560, 470, 'curly-mask')));
  playerDeck.forEach(function (card) {
    card.events.onInputDown.add(cardAction, card);
    card.events.onInputOver.add(tooltip, card);
    card.events.onInputOut.add(deleteTooltip, card);
  });
  //adding in credibility/health bar
  var barConfig = {x:160, y:game.world.height - 150, height:20, width:150};
  credBar = new HealthBar(game, barConfig);
  //adding opponent face and opponent cards --to do: fetch these from main game state
  game.add.sprite(100, game.world.height - 490, 'goblin-head');
  opponentDeck.push(game.add.existing(new Argument(game, 130, game.world.centerY - 50, 'lunar-module', 'greek-sphinx')));
  opponentDeck.push(game.add.existing(new Argument(game, 245, game.world.centerY - 135, 'fencer', 'cyborg-face')));
};


function cardAction() {
  if (playerTurn) {
    playerTurn = false;
    this.inputEnabled = false;
    var tween = this.game.add.tween(this);
    tween.to({ x: 125, y: this.game.world.height - 250}, 1000, 'Linear', true, 0);
    tween.onComplete.add(function () {
      if (this.key == opponentDeck[currentArgument].key){
        opponentDeck[currentArgument].destroy();
        delete opponentDeck[currentArgument];
      }
      var game = this.game;
      this.destroy();
      opponentTurn(game);
    }, this);
  }
}


function tooltip() {
  this.game.slickUI.add(panel = new SlickUI.Element.Panel(this.x - 10, this.y - 60, 100, 50));
  panel.add(new SlickUI.Element.Text(0,0, 'test')).center();
}

function deleteTooltip () {
  if (panel) {
    panel.destroy();
  }
}

function opponentTurn(game) {
  if (opponentDeck[currentArgument]) {
    cred -= 1;
    credBar.setPercent(cred * 25);
    opponentDeck[currentArgument].destroy();
  }
  currentArgument += 1;
  if (currentArgument < opponentDeck.length) {
    var tween = game.add.tween(opponentDeck[currentArgument]);
    tween.to({ x: 130, y: game.world.centerY - 30}, 1000, 'Linear', true, 0);
    tween.onComplete.add(function () {
      playerTurn = true;
    }, this);
  }
}

