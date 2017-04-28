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

exports.preload = function(game) {
  // preload all UI menu themes.
  game.slickUI.load('ui/kenney-theme/kenney.json');
};

exports.create = function (game) {
  this.camera.flash('#000000', 2000);
  game.player = game.add.existing(new Player(game));

  game.room = game.add.existing(new Room(game, 'shuttle'));
  game.room.addItems();

  // custom actions for conversations
  var customActions = new CustomActions(game);
  // conversation manager
  var convoManager = new ConversationManager(game, customActions);
  // dialogue window object
  game.dialogueWindow = new DialogueWindow(game, convoManager);
  game.dialogueWindow.begin('prologue01');
};