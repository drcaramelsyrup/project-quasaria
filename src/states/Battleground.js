'use strict';

var Card = require('../objects/Card');
var Argument = require('../objects/Argument');
var items = require('../../static/assets/items.json');
var Player = require('../objects/Player');

var BattleUi = require('../objects/BattleUi.js');
var ArgumentManager = require('../objects/ArgumentManager');
var DialogueWindow = require('../objects/DialogueWindow');

exports.preload = function(game) {
  // preload all UI menu themes.
  game.slickUI.load('ui/kenney-theme/kenney.json');
};

exports.create = function (game) {
  if (game.player == null || typeof game.player == 'undefined')
      game.player = game.add.existing(new Player(game));
  // DUMMY DATA
  game.player.inventory.push('listener');
  game.player.inventory.push('note');
  // END DUMMY DATA

  game.argumentManager = new ArgumentManager(game);
  game.currentArgument = 0;
  game.playerTurn = true;
  game.cred = 4;

  // adding in player cards and face --to do: fetch these from inventory/player skills;
  game.playerDeck = [];
  for (var i = 0; i < game.player.inventory.length; i++) {
    game.playerDeck.push(new Card(game, 0,0, items[game.player.inventory[i]]['id']));
  }
  console.log(game.playerDeck);

  // adding opponent face and opponent cards --to do: fetch these from main game state
  game.opponentDeck = [];
  game.opponentDeck.push(new Argument(game, 130, game.world.centerY - 50, 'lunar-module', 'listener'));
  game.opponentDeck.push(new Argument(game, 245, game.world.centerY - 135, 'fencer', 'note'));

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

