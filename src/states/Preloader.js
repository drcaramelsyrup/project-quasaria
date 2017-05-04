/*
 * Preloader state
 * ===============
 *
 * Takes care of loading the main game assets, including graphics and sound
 * effects, while displaying a busy splash screen.
 */

'use strict';

var assets = require('../assets');

function showSplashScreen (game) {
  game.add.image(0, 0, 'splash-screen');
  game.load.setPreloadSprite(game.add.image(82, 282, 'progress-bar'));
}

exports.preload = function (game) {
  showSplashScreen(game);
  game.load.pack('game', null, assets);
  game.load.pack('ui', null, assets);
  game.load.pack('conversations', null, assets);
  game.load.pack('sounds', null, assets);
  game.load.pack('logic_battle', null, assets);
};

exports.create = function (game) {
  // Here is a good place to initialize plugins dependent of any game asset.
  // Don't forget to `require` them first. Example:
  //game.myPlugin = game.plugins.add(MyPlugin/*, ... parameters ... */);

  // Slick UI initialization; added from index.html
  // NOTE: slick UI loads theme from cache
  // between preload and create functions FOR EACH STATE
  game.slickUI = game.plugins.add(Phaser.Plugin.SlickUI);

  game.state.start('Game');

};
