'use strict';

var Card = require('../objects/Card');
var Argument = require('../objects/Argument');
var HealthBar = require('../objects/HealthBar.js');
var items = require('../../static/assets/items.json');

var BattleUi = require('../objects/BattleUi.js');
var ArgumentManager = require('../objects/ArgumentManager');
var DialogueWindow = require('../objects/DialogueWindow');

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
  game.argumentManager = new ArgumentManager(game);

  //adding in player cards and face --to do: fetch these from inventory/player skills;
  // game.add.sprite(100, game.world.height - 125, 'alien-stare');
  var playerDeck = [];
  playerDeck.push(new Card(game, 0, 0, 'greek-sphinx'));
  playerDeck.push(new Card(game, 0, 0, 'cyborg-face'));
  playerDeck.push(new Card(game, 0, 0, 'curly-mask'));
  // //adding in credibility/health bar
  // var barConfig = {x:160, y:game.world.height - 150, height:20, width:150};
  // credBar = new HealthBar(game, barConfig);
  // //adding opponent face and opponent cards --to do: fetch these from main game state
  // game.add.sprite(100, game.world.height - 490, 'goblin-head');
  // var opponentDeck = [];
  opponentDeck.push(new Argument(game, 130, game.world.centerY - 50, 'lunar-module', 'greek-sphinx'));
  opponentDeck.push(new Argument(game, 245, game.world.centerY - 135, 'fencer', 'cyborg-face'));

  game.battleUi = new BattleUi(game, playerDeck, opponentDeck);
  game.battleUi.cardSignal.add(cardAction, this);

  game.dialogueWindow = new DialogueWindow(game, game.argumentManager);
  game.dialogueWindow.begin('battle01');

};

exports.update = function (game) {
  // signal listener for ui

  // player action
  // check action
  // update and play animations accordingly
  // dialogue window responses
  // next turn

}


// function cardAction() {
//   if (playerTurn) {
//     playerTurn = false;
//     this.inputEnabled = false;
//     var tween = this.game.add.tween(this);
//     tween.to({ x: 125, y: this.game.world.height - 250}, 1000, 'Linear', true, 0);
//     tween.onComplete.add(function () {
//       if (this.key === opponentDeck[currentArgument].key){
//         opponentDeck[currentArgument].destroy();
//         delete opponentDeck[currentArgument];
//       }
//       var game = this.game;
//       this.destroy();
//       opponentTurn(game);
//     }, this);
//   }
// }

function cardAction(game, card) {
  if (playerTurn) {
    // playerTurn = false;
    card.inputEnabled = false;
    console.log(card.key);
    if (card.key === opponentDeck[currentArgument].key) {
      game.battleUi.playCardAnimation(card, opponentDeck[currentArgument]);
      opponentDeck[currentArgument].destroy();
      delete opponentDeck[currentArgument];
    }
  }
  card.destroy();

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

