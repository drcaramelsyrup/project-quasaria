/*
 * Game state
 * ==========
 *
 * A sample Game state, displaying the Phaser logo.
 */

'use strict';

var Room = require('../objects/Room');
var Clickable = require('../objects/Clickable');
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

  transitionRoom(game, 'shuttle-bg');

  // custom actions for conversations
  var customActions = new CustomActions(game);
  // conversation manager
  var convoManager = new ConversationManager(game, customActions);
  // dialogue window object
  game.dialogueWindow = new DialogueWindow(game, convoManager);
  game.dialogueWindow.begin('prologue01');
};

function transitionRoom(game, room) {
  // shuttle room background
  var roomX = game.world.centerX;
  var roomY = game.world.centerY;
  game.add.existing(new Room(game, roomX, roomY, room));

  // clickable orb in room
  var orbX = 150;
  var orbY = 150;
  game.add.existing(new Clickable(game, orbX, orbY, 'listener-obj'));

  // clickable note
  game.add.existing(new Clickable(game, 720, 200, 'note-obj'));
}