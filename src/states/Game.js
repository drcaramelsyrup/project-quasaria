/*
 * Game state
 * ==========
 *
 * A sample Game state, displaying the Phaser logo.
 */

'use strict';

var Logo = require('../objects/Logo');

exports.preload = function(game) {
  // preload all menu themes.
  game.slickUI.load('ui/kenney-theme/kenney.json');
};

exports.create = function (game) {
  // TODO: Replace this with a really cool game code here :)
  var x = game.world.centerX;
  var y = game.world.centerY;
  game.add.existing(new Logo(game, x, y));

  var panel;
  game.slickUI.add(panel = new SlickUI.Element.Panel(8, 8, 150, game.height - 16));

  var button;
  panel.add(button = new SlickUI.Element.Button(0,0, 140, 80));
  button.events.onInputUp.add(function () {console.log('Clicked button');});
  button.add(new SlickUI.Element.Text(0,0, 'My button')).center();
};
