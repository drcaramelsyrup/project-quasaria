'use strict';

var Card = require('../objects/Card');
var Tactic = require('../objects/Tactic');
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
  // Companions
  game.companions = ['Mysterious Voice', 'Kismet'];  // DUMMY DATA

  // Music
  if (typeof game.music !== 'undefined' && game.music !== null)
    game.music.fadeOut(1000); // fade out previous music

  game.argumentManager = new ArgumentManager(game);
  var customActions = new CustomActions(game);
  game.argumentManager = new ArgumentManager(game, customActions);

  game.argumentManager.loadJSONConversation('battle01');
  game.currentArgument = 0;
  game.playerTurn = true;
  game.cred = 4;
  game.persuasion = 5;
  game.turnCount = 0;

  // adding in player cards and face
  game.playerDeck = [];
  for (var i = 0; i < game.player.inventory.length; i++) {
    game.playerDeck.push(new Card(game, 0,0, items[game.player.inventory[i]]['id']));
  }

  // adding opponent face and opponent cards --to do: fetch these from main game state
  game.opponentDeck = [];
  game.args = game.argumentManager.getAllArguments();
  for (i = 0; i < game.args.length; i++) {
    // TODO: support for multiple counters
    if ('bluff' in game.args[i] && game.args[i]['bluff'] === true) {
      // do not include bluffs
      continue;
    }
    if (game.args[i]['counters'].length <= 0)
      continue;
    game.opponentDeck.push(new Argument(game, 0,0, game.args[i]['id'], game.args[i]['counters'][0], i));
  }

  game.battleUi = new BattleUi(game, game.playerDeck, game.opponentDeck);
  game.battleUi.cardSignal.add(cardAction, this);
  game.battleUi.companionSignal.add(companionText, this);

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
  game.argumentManager.specialCompleteSignal.add(function () {
    /* Fun intro display stuff */
    // Display overlay and intro text
    var introTween = game.battleUi.introTweens();
    introTween.onComplete.add(function () {
      game.battleUi.battleStart();  // enable cards and reveal current arg
      game.dialogueWindow.display();
   
      // Start music
      game.music = game.sound.play('off-limits');
      game.music.fadeIn(1000);
      game.music.loopFull(1);
    });

    game.argumentManager.specialCompleteSignal.removeAll();
  });

  game.turnCount = 1;
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
      if (!card.multiUse) {
        card.destroy();
      }
        
    } else {
      game.battleUi.playCardAnimation(card, argument, false);

    }

    var textType = isCorrect ? 'correct' : 'incorrect';

    game.battleUi.cardAnimCompleteSignal.add(argumentInterlude, this, game, textType);
  }
}

function companionText(game, speaker) {
  if (game.playerTurn) {
    game.dialogueWindow.skipText();
    game.battleUi.cardsInputEnabled(false);

    game.argumentManager.startInterlude(speaker);
    game.dialogueWindow.display();

    game.argumentManager.interludeCompleteSignal.add(function () {
      game.battleUi.cardsInputEnabled(true);
      game.dialogueWindow.display();
      game.argumentManager.interludeCompleteSignal.removeAll();
    });
  }
}

function argumentInterlude(game, type) {
  game.argumentManager.startInterlude(type);
  game.dialogueWindow.display();
  game.argumentManager.interludeCompleteSignal.add(function () {
    opponentTurn(game);
    game.argumentManager.interludeCompleteSignal.removeAll();
  });

  game.battleUi.cardAnimCompleteSignal.removeAll();
}

function gleamingShoalBluff(game) {
  game.argumentManager.startSpecialArgument('ability', 'bluff');
  game.dialogueWindow.display();

  // special bluff. hard-coded.
  var lastArgument = game.opponentDeck.pop();
  for (var i = 0; i < game.args.length; i++) {
    if ('bluff' in game.args[i] && game.args[i]['bluff'] === true) {
      // TODO: use Mersenne-Twister for more randomness
      var randPosition = Math.random();
      var newBluff = new Argument(game, 0,0, game.args[i]['id'], game.args[i]['counters'][0], i);
      if (randPosition > 0.5) {
        game.opponentDeck.unshift(newBluff);
      } else {
        game.opponentDeck.push(newBluff);
      }
    }
  }
  // add last argument to the end.
  game.opponentDeck.push(lastArgument);
}

function giveCallBluffTactic(game) {
  // Give player a special Call Bluff tactic.
  var callBluff = new Tactic(game, 0, 0, 'call-bluff', true /* multiUse */);
  game.playerDeck.push(callBluff);
  game.battleUi.makeCardIcon(callBluff);
}

/** TODO: HARDCODED SPECIAL ACTIONS = AWFUL */
function checkSpecialActions(game) {
  return game.turnCount === 2;
}
function specialActions(game) {
  if (game.turnCount === 2) {
    // on the second turn, bluff
    gleamingShoalBluff(game); // adds arguments into model
    // when we finish the ability text...
    game.argumentManager.specialCompleteSignal.add(function () {
      // shuffle
      var rouletteTween = game.battleUi.rouletteArguments();
      rouletteTween.onComplete.add(function () {
        // add arguments into ui view
        updateCurrentArgument(game);
        game.battleUi.updateArguments(game.opponentDeck, game.currentArgument);
        game.battleUi.positionArguments(game);
        game.battleUi.argAnimCompleteSignal.add(function () {
          finishOpponentTurn(game);
          giveCallBluffTactic(game);
          game.battleUi.argAnimCompleteSignal.removeAll();
        });
      }, this);
      game.argumentManager.specialCompleteSignal.removeAll();
    });
    
    return true;
  }
  // TODO: randomly entrench or shuffle
  if (game.turnCount > 2) {
    // do nothing for now.
    return false;
  }
}

function opponentTurn(game) {
  game.turnCount++;

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
    var hasSpecialAction = checkSpecialActions(game);
    if (hasSpecialAction) {
      game.battleUi.argAnimCompleteSignal.removeAll();
      specialActions(game);
      return;
    }
    finishOpponentTurn(game);
    game.battleUi.argAnimCompleteSignal.removeAll();
  }, this);

}

function finishOpponentTurn(game) {
  // upon finishing argument positioning
  // reveal current argument
  game.battleUi.revealCurrent();

  // reenable player input and start player turn
  updateArgumentWindow(game);
  game.battleUi.positionCards();
  game.battleUi.cardsInputEnabled(true);
  game.playerTurn = true;
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
