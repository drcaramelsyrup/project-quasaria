'use strict';

var Card = require('../objects/Card');
var Argument = require('../objects/Argument');
var items = require('../../static/assets/items.json');
var Player = require('../objects/Player');
var Room = require('../objects/Room');

var BattleUi = require('../objects/BattleUi.js');
var ArgumentManager = require('../objects/ArgumentManager');
var DialogueWindow = require('../objects/DialogueWindow');
var CustomActions = require('../utils/CustomActions');

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
    game.room = (new Room(game, 'hangar'));
    // END DUMMY DATA
  }

  // Music
  if (typeof game.music !== 'undefined' && game.music !== null)
    game.music.fadeOut(1000); // fade out previous music
  game.music = game.sound.play('battle-theme');
  game.music.loopFull(0.95);
    
  var customActions = new CustomActions(game);
  game.argumentManager = new ArgumentManager(game, customActions);
  game.argumentManager.loadJSONConversation('battle01');
  game.currentArgument = 0;
  game.playerTurn = true;
  game.cred = 4;
  game.persuasion = 4;

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
    game.dialogueWindow.skipText();

    game.playerTurn = false;
    game.battleUi.cardsInputEnabled(false);

    var argument = game.opponentDeck[game.currentArgument];

    var isCorrect = card.key === argument.key;

    if (isCorrect) {
      game.battleUi.playCardAnimation(card, argument, true);
      game.opponentDeck[game.currentArgument] = undefined;
      argument.destroy();
      card.destroy();
    } else {
      game.battleUi.playCardAnimation(card, argument, false);
    }

    game.battleUi.cardAnimCompleteSignal.add(argumentInterlude, this, game, isCorrect);
  }
}

function argumentInterlude(game, isCorrect) {
  game.argumentManager.startArgInterlude(isCorrect);
  game.dialogueWindow.display();
  game.argumentManager.interludeCompleteSignal.add(opponentTurn, this, 0, game);

  game.battleUi.cardAnimCompleteSignal.removeAll();
}

function opponentTurn(game) {
  if (game.opponentDeck[game.currentArgument] === null) {
    game.persuasion -= 1;
    game.battleUi.updatePersuasionBar();    
  } else if (game.opponentDeck[game.currentArgument]) {
    game.cred -= 1;
    game.battleUi.updateCredBar(game.cred, true); // update cred bar with damage indication
    game.opponentDeck[game.currentArgument].destroy();
  }
  updateCurrentArgument(game);
  game.battleUi.updateArguments(game.opponentDeck, game.currentArgument);
  game.battleUi.positionArguments(game, true);
  // Display arguments on animation completion
  game.battleUi.argAnimCompleteSignal.add(function () {
    updateArgumentWindow(game);
    game.battleUi.cardsInputEnabled(true);
    game.playerTurn = true;
    game.battleUi.argAnimCompleteSignal.removeAll();
  }, this);

  game.argumentManager.interludeCompleteSignal.removeAll();
}

function updateArgumentWindow(game) {
  game.argumentManager.advanceToTarget(game.currentArgument);
  if(game.cred === 0) {
    game.argumentManager.idx = 3;
  }
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
