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
var DialogueWindow = require('../objects/DialogueWindow');
var ConversationManager = require('../objects/ConversationManager');

exports.preload = function(game) {
  // preload all UI menu themes.
  game.slickUI.load('ui/kenney-theme/kenney.json');
};

exports.create = function (game) {
  // placeholder image
  var logoX = game.world.centerX;
  var logoY = game.world.centerY - game.width / 6;
  game.add.existing(new Logo(game, logoX, logoY));

  // shuttle room background
  var roomX = game.world.centerX;
  var roomY = game.world.centerY;
  game.add.existing(new Room(game, roomX, roomY, 'shuttle-bg'));

  // clickable orb in room
  var orbX = 150;
  var orbY = 150;
  game.add.existing(new Clickable(game, orbX, orbY, 'listener-obj'));

  // conversation manager
  var convoManager = new ConversationManager(game);
  // dialogue window object
  var dialogueWindow = new DialogueWindow(game, convoManager);
  dialogueWindow.begin('prologue01');
};

