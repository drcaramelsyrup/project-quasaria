/*
 * Preloader state
 * ===============
 *
 * Takes care of loading the main game assets, including graphics and sound
 * effects, while displaying a busy splash screen.
 */

'use strict';


exports.create = function (game) {

  //might not be in quotes, its an issue below
  var screen = game.add.sprite(game.world.centerX, game.world.centerY, 'pause_screen');
  screen.anchor.setTo(0.5, 0.5);
//  Phaser.Sprite.call(this, game, game.world.centerX, game.world.centerY, 'continueButton');
  //var contButton;
  var contButton = game.add.button(game.world.centerX, 300, 'continueButton', loadGame(game));
  contButton.anchor.setTo(0.5, 0.5);

  //TODO delete this shit
  //TODO: move this elsewhere game.state.start('Game');
//  game.state.start('MainMenu');

};

function loadGame (game){
  let resumeGame = true;
  game.state.start('Game', true, false, resumeGame);
}
