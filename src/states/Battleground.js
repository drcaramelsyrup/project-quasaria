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
  
  game.music = game.sound.play('off-limits');
  game.music.fadeIn(3000);
  game.music.loopFull(1);

  game.argumentManager = new ArgumentManager(game);
  var customActions = new CustomActions(game);
  game.argumentManager = new ArgumentManager(game, customActions);

  game.argumentManager.loadJSONConversation('battle01');
  game.currentArgument = 0;
  game.playerTurn = true;
  game.cred = 4;
  game.persuasion = 2;

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
    if ('bluff' in args[i] && args[i]['bluff'] === true) {
      // do not include bluffs
      continue;
    }
    if (args[i]['counters'].length <= 0)
      continue;
    game.opponentDeck.push(new Argument(game, 0,0, args[i]['id'], args[i]['counters'][0], i));
  }

  game.battleUi = new BattleUi(game, game.playerDeck, game.opponentDeck);
  game.battleUi.cardSignal.add(cardAction, this);

  game.dialogueWindow = new DialogueWindow(game, game.argumentManager);
  startLogicBattle(game);
};

function startLogicBattle(game) {
  // Load JSON
  game.dialogueWindow.loadJSONConversation('battle01');

  // Play intro sequence and display
  game.argumentManager.startSpecialArgument('intro');
  game.dialogueWindow.display();

  // Disable and then reenable input
  game.battleUi.cardsInputEnabled(false);
  game.argumentManager.introCompleteSignal.add(function () {
    game.battleUi.cardsInputEnabled(true);

    /* Fun intro display stuff */
    // Start music
    game.music = game.sound.play('battle-theme');
    game.music.loopFull(0.95);
    // Display overlay and intro text

    game.argumentManager.introCompleteSignal.removeAll();
  });
}

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
  game.argumentManager.startInterlude(isCorrect);
  game.dialogueWindow.display();
  game.argumentManager.interludeCompleteSignal.add(opponentTurn, this, 0, game);

  game.battleUi.cardAnimCompleteSignal.removeAll();
}

function opponentTurn(game) {
  console.log(game.currentArgument);
  if (game.opponentDeck[game.currentArgument] === undefined) {
    game.persuasion -= 1;
    game.battleUi.updatePersuasionBar();    
  } else if (game.opponentDeck[game.currentArgument]) {

    game.cred -= 1;
    game.battleUi.updateCredBar(game.cred, true); // update cred bar with damage indication
  } else {
    game.persuasion -= 1;
    game.battleUi.updatePersuasionBar();
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

function useOpponentAbility(game) {
  
}

// For ArgumentManager
function currentArgumentJsonIdx(game) {
  var currentArgument = game.opponentDeck[game.currentArgument];
  if (!currentArgument)
    return -1;
  return currentArgument.jsonIdx;
}

function updateArgumentWindow(game) {
  game.argumentManager.advanceToTarget(currentArgumentJsonIdx(game));
  if(game.cred === 0) {
    game.argumentManager.startSpecialArgument('lose');
  }
  if(game.persuasion === 0) {
    game.argumentManager.startSpecialArgument('win');
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
