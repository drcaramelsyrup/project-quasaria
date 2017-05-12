'use strict';

var Card = require('../objects/Card');
var Argument = require('../objects/Argument');
var HealthBar = require('../objects/HealthBar.js');
var items = require('../../static/assets/items.json');

var BattleUi = require('../objects/BattleUi.js');
var ArgumentManager = require('../objects/ArgumentManager');
var DialogueWindow = require('../objects/DialogueWindow');

exports.preload = function(game) {
  // preload all UI menu themes.
  game.slickUI.load('ui/kenney-theme/kenney.json');
};

exports.create = function (game) {
  game.argumentManager = new ArgumentManager(game);
  game.currentArgument = 0;
  game.playerTurn = true;
  game.cred = 4;

  // adding in player cards and face --to do: fetch these from inventory/player skills;
  game.playerDeck = [];
  game.playerDeck.push(new Card(game, 0, 0, 'greek-sphinx'));
  game.playerDeck.push(new Card(game, 0, 0, 'cyborg-face'));
  game.playerDeck.push(new Card(game, 0, 0, 'curly-mask'));

  // adding opponent face and opponent cards --to do: fetch these from main game state
  game.opponentDeck = [];
  game.opponentDeck.push(new Argument(game, 130, game.world.centerY - 50, 'lunar-module', 'greek-sphinx'));
  game.opponentDeck.push(new Argument(game, 245, game.world.centerY - 135, 'fencer', 'cyborg-face'));

  game.battleUi = new BattleUi(game, game.playerDeck, game.opponentDeck);
  game.battleUi.cardSignal.add(cardAction, this);

  game.dialogueWindow = new DialogueWindow(game, game.argumentManager);
  game.dialogueWindow.begin('battle01');

};

function cardAction(game, card) {
  if (game.playerTurn) {
    game.playerTurn = false;
    game.battleUi.cardsInputEnabled(false);

    var argument = game.opponentDeck[game.currentArgument];

    if (card.key === argument.key) {
      game.battleUi.playCardAnimation(card, argument, true);
      game.opponentDeck[game.currentArgument] = undefined;
      argument.destroy();
      card.destroy();
    }
    else {
      game.battleUi.playCardAnimation(card, argument, false);
    }
  }

  game.battleUi.cardAnimCompleteSignal.add(opponentTurn, this);
}

function opponentTurn(game) {
  if (game.opponentDeck[game.currentArgument]) {
    game.cred -= 1;
    game.battleUi.updateCredBar(game.cred);
    game.opponentDeck[game.currentArgument].destroy();
  }
  updateCurrentArgument(game);
  game.battleUi.updateArguments(game.opponentDeck);
  game.battleUi.positionArguments(game, true);
  game.battleUi.cardsInputEnabled(true);
  game.playerTurn = true;
}

function updateCurrentArgument(game) {
  game.currentArgument += 1;
  for (var i = 0; i < game.opponentDeck.length; i++) {
    var idx = game.currentArgument + i;
    if (idx >= game.opponentDeck.length)
      idx -= game.opponentDeck.length;
    // if exists
    if (typeof game.opponentDeck[idx] !== 'undefined' && game.opponentDeck[i] !== null)
      game.currentArgument = idx;
  }
}

