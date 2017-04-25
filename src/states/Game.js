/*
 * Game state
 * ==========
 *
 * A sample Game state, displaying the Phaser logo.
 */

'use strict';

var Logo = require('../objects/Logo');
var Room = require('../objects/Room');
var Clickable = require('../objects/Clickable');
var Player = require('../objects/Player');
var DialogueWindow = require('../objects/DialogueWindow');
var ConversationManager = require('../objects/ConversationManager');

exports.preload = function(game) {
  // preload all UI menu themes.
  game.slickUI.load('ui/kenney-theme/kenney.json');
};

exports.create = function (game) {
  game.player = game.add.existing(new Player(game));

  transitionRoom(game, 'shuttle');

  // conversation manager
  var convoManager = new ConversationManager(game);
  // dialogue window object
  game.dialogueWindow = new DialogueWindow(game, convoManager);
  game.dialogueWindow.begin('prologue01');
};

function transitionRoom(game, room) {
  // shuttle room background
  var roomX = game.world.centerX;
  var roomY = game.world.centerY;
  game.add.existing(new Room(game, roomX, roomY, 'shuttle-bg'));

  // clickable orb in room
  var orbX = 150;
  var orbY = 150;
  game.add.existing(new Clickable(game, orbX, orbY, 'listener-obj'));

  // clickable note
  game.add.existing(new Clickable(game, 720, 200, 'note-obj'));
}