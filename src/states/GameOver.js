/*
* Game Over state
* ===============
*
* The player should be able to restart a saved game or return to the main menu..
*
*/

'use strict';

exports.init = function(game, gameOverText) {
  this.gameOverText = gameOverText;
};

exports.create = function (game) {
  this.camera.flash('#000000', 2000);

  if (typeof game.music !== 'undefined' && game.music !== null)
    game.music.fadeOut(1000); // fade out previous music
  game.music = game.sound.play('cold-moon');
  game.music.loopFull(1);
  //might not be in quotes, its an issue below
  var screen = game.add.sprite(game.world.centerX, game.world.centerY, 'menu_screen');
  screen.anchor.setTo(0.5, 0.5);

  let screenFont = 'Cinzel Decorative';
  let fillColor = '#42dff4';

  var titleText = game.add.text(game.world.centerX, game.world.centerY- 85, 'Game Over', {
    font: '75px ' + screenFont,
    fontWeight: 'bold',
    fill: fillColor,
    align: 'center'
  });

  var descText = game.add.text(game.world.centerX, game.world.centerY - 20, this.gameOverText, {
    font: '25px ' + screenFont,
    fill: fillColor,
    align: 'center'
  });

  var contText = game.add.text(game.world.centerX, game.world.centerY + 30, 'Reload', {
    font: '50px ' + screenFont,
    fill: fillColor,
    align: 'center'
  });

  var mainMenuText = game.add.text(game.world.centerX, game.world.centerY + 85, 'Main Menu', {
    font: '50px ' + screenFont,
    fill: fillColor,
    align: 'center'
  });

  titleText.anchor.setTo(0.5, 0.5);

  descText.anchor.setTo(0.5, 0.5);

  contText.anchor.setTo(0.5, 0.5);
  contText.inputEnabled = true;
  contText.events.onInputOver.add(function() {
    contText.fill = '#ff00ff';
  }, this);

  contText.events.onInputOut.add(function() {
    contText.fill = '#42dff4';
  }, this);

  contText.events.onInputDown.add(function () {
    let resumeGame = true;
    game.state.start('Game', true, false, game, resumeGame);
  }, this);

  mainMenuText.anchor.setTo(0.5, 0.5);
  mainMenuText.inputEnabled = true;
  mainMenuText.events.onInputOver.add(function() {
    mainMenuText.fill = '#ff00ff';
  }, this);

  mainMenuText.events.onInputOut.add(function() {
    mainMenuText.fill = '#42dff4';
  }, this);

  mainMenuText.events.onInputDown.add(function () {
    game.state.start('MainMenu');
  }, this);

};
