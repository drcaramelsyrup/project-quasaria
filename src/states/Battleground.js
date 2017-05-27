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
  if (game.player === null || typeof game.player === 'undefined') {
    game.player = game.add.existing(new Player(game));
    // DUMMY DATA
    game.player.inventory.push('listener');
    game.player.inventory.push('note');
    // END DUMMY DATA
  }

  // Music
  game.music = game.sound.play('battle-theme');
  game.music.loopFull(1);
  
  game.argumentManager = new ArgumentManager(game);
  game.argumentManager.loadJSONConversation('battle01');
  game.currentArgument = 0;
  game.playerTurn = true;
  game.cred = 4;

  // adding in player cards and face
  game.playerDeck = [];
  for (var i = 0; i < game.player.inventory.length; i++) {
    game.playerDeck.push(new Card(game, 0,0, items[game.player.inventory[i]]['id']));
  }

  // adding opponent face and opponent cards --to do: fetch these from main game state
  game.opponentDeck = [];
  var args = game.argumentManager.getAllArguments();
  for (i = 0; i < args.length; i++) {
    // TODO: support for multiple counters
    game.opponentDeck.push(new Argument(game, 0,0, args[i]['id'], args[i]['counters'][0]));
  }

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
  game.battleUi.updateArguments(game.opponentDeck, game.currentArgument);
  game.battleUi.positionArguments(game, true);
  // Display arguments on animation completion
  game.battleUi.argAnimCompleteSignal.add(updateArgumentWindow, this);

  game.battleUi.cardsInputEnabled(true);
  game.playerTurn = true;
}

function updateArgumentWindow(game) {
  game.argumentManager.idx = game.currentArgument;
  game.dialogueWindow.display();
}

function updateCurrentArgument(game) {
  game.currentArgument += 1;
  
  for (var i = 0; i < game.opponentDeck.length; i++) {
    var idx = game.currentArgument + i;
    if (idx >= game.opponentDeck.length)
      idx -= game.opponentDeck.length;
    // if exists
    if (typeof game.opponentDeck[idx] !== 'undefined' && game.opponentDeck[idx] !== null) {
      game.currentArgument = idx;
      return;
    }
  }
  // exiting means we have no more arguments
}
