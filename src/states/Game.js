/*
* Game state
* ==========
*
* A sample Game state, displaying the Phaser logo.
*/

'use strict';

var Room = require('../objects/Room');
var Player = require('../objects/Player');
var DialogueWindow = require('../objects/DialogueWindow');
var ConversationManager = require('../objects/ConversationManager');
var CustomActions = require('../utils/CustomActions');
var MemoryBankWindow = require('../objects/MemoryBankWindow');

exports.preload = function(game) {
  // preload all UI menu themes.
  game.slickUI.load('ui/kenney-theme/kenney.json');
};

exports.init = function(game, resumeGame){
  console.log(resumeGame);
  let playerState = localStorage.getItem('playerState');
  if (resumeGame && playerState !== null){
    Player.unserialize(playerState, game);
    var area = JSON.parse(JSON.stringify(game.player.currentRoom));
    game.room = game.add.existing(new Room(game, area.id));
    game.room.area = area;
    game.room.addItems();
  } else { //check if old model blinks 
    localStorage.clear();
    game.player = game.add.existing(new Player(game));
    game.room = game.add.existing(new Room(game, 'shuttle'));
    game.room.addItems();
  }

}

exports.create = function (game) {
  this.camera.flash('#000000', 2000);


  game.music = game.sound.play('minor-arpeggio');
  game.music.loopFull(1);




  // custom actions for conversations
  var customActions = new CustomActions(game);
  // conversation manager
  var convoManager = new ConversationManager(game, customActions);
  // dialogue window object
  game.dialogueWindow = new DialogueWindow(game, convoManager);
  // memory bank window object
  game.memoryBankWindow = new MemoryBankWindow(game);

  game.dialogueWindow.begin('prologue01');
};
