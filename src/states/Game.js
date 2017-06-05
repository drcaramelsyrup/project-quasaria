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
var AreaTransitionWindow = require('../objects/AreaTransitionWindow');
var SaveButton = require('../objects/SaveButton');

exports.preload = function(game) {
  // preload all UI menu themes.
  game.slickUI.load('ui/kenney-theme/kenney.json');
};

exports.init = function(game, resumeGame){

  let playerState = localStorage.getItem('playerState');
  if (resumeGame && playerState !== null){
    Player.unserialize(playerState, game);
    //current room is actually room.area
    //need to deep copy, otherwise we will loose the area info
    var area = JSON.parse(JSON.stringify(game.player.currentRoom));
    game.room = (new Room(game, area.id));
    game.room.area = area;

  } else { //check if old model blinks
    localStorage.clear();
    game.player = (new Player(game));
    game.player.convoFile = 'prologue01';
    game.room = (new Room(game, 'shuttle'));

  }

};

exports.create = function (game) {

  this.camera.flash('#000000', 2000);
  game.add.existing(game.player);

  game.add.existing(game.room);
  game.room.addItems();

  if (typeof game.music !== 'undefined' && game.music !== null)
    game.music.fadeOut(1000); // fade out previous music
  game.music = game.sound.play('puzzle');
  game.music.loopFull(1);

  game.add.existing(new SaveButton(game));

  // custom actions for conversations
  var customActions = new CustomActions(game);
  // conversation manager
  var convoManager = new ConversationManager(game, customActions);
  convoManager.idx = game.player.convoIdx;
  convoManager.shown = game.player.shownConvo;

  console.log('game state player ', game.player);

  // dialogue window object
  game.dialogueWindow = new DialogueWindow(game, convoManager);
  // memory bank window object
  game.memoryBankWindow = new MemoryBankWindow(game);
  // area transition window object
  game.areaTransitionWindow = new AreaTransitionWindow(game);

  game.dialogueWindow.begin(game.player.convoFile);

};
