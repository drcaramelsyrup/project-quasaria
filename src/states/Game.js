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

  // Basic dialogue window
  var dialogPadding = 32;
  var dialogHeight = game.height / 3;
  var dialogWidth = game.width - dialogPadding;
  var dialogTextOriginX = 12;
  var dialogTextOriginY = 34;

  var dialogX = dialogPadding / 2;
  var dialogY = game.height * 2 / 3;  // 1/3 from bottom of screen

  var dialogPanel;
  game.slickUI.add(dialogPanel = new SlickUI.Element.Panel(dialogX, dialogY, dialogWidth, dialogHeight));

  // dialogue text
  dialogPanel.add(new SlickUI.Element.Text(10, 0, 'Speaker')).centerHorizontally().text.alpha = 0.5;
  dialogPanel.add(new SlickUI.Element.Text(dialogTextOriginX, dialogTextOriginY, 'Sample Speech'));

  // with a navigation button!
  var nextButton;
  var nextButtonWidth = 32;
  var nextButtonHeight = 32;
  dialogPanel.add(nextButton = new SlickUI.Element.Button(dialogWidth - nextButtonWidth,dialogHeight / 2 - nextButtonHeight / 2, nextButtonWidth, nextButtonHeight));
  nextButton.events.onInputUp.add(function () {console.log('Clicked button');});
  nextButton.add(new SlickUI.Element.Text(0,0, '>')).center();
};

