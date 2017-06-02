/*
* Main Menu state
* ===============
*
* The player should be able to restart a saved game or start a new game.
*
*/

'use strict';

exports.create = function (game) {

  //might not be in quotes, its an issue below
  var screen = game.add.sprite(game.world.centerX, game.world.centerY, 'menu_screen');
  screen.anchor.setTo(0.5, 0.5);

  var logo = game.add.sprite(game.world.centerX, game.world.centerY - 30, 'quasaria-logo-MM');
  logo.anchor.setTo(0.5, 0.5);
  logo.alpha = .1;

  let screenFont = 'Cinzel Decorative';
  let fillColor = '#42dff4';

  var titleText = game.add.text(game.world.centerX, game.world.centerY- 75, 'Quasaria', {
    font: '75px ' + screenFont,
    fontWeight: 'bold',
    fill: fillColor,
    align: 'center'
  });

  var contText = game.add.text(game.world.centerX, game.world.centerY, 'Continue', {
    font: '50px ' + screenFont,
    fill: fillColor,
    align: 'center'
  });

  var newGameText = game.add.text(game.world.centerX, game.world.centerY + 55, 'New Game', {
    font: '50px ' + screenFont,
    fill: fillColor,
    align: 'center'
  });

  titleText.anchor.setTo(0.5, 0.5);


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

  newGameText.anchor.setTo(0.5, 0.5);
  newGameText.inputEnabled = true;
  newGameText.events.onInputOver.add(function() {
    newGameText.fill = '#ff00ff';
  }, this);

  newGameText.events.onInputOut.add(function() {
    newGameText.fill = '#42dff4';
  }, this);

  newGameText.events.onInputDown.add(function () {
    console.log('you loaded game.');
    let resumeGame = false;
    game.state.start('Game', true, false, game, resumeGame);
  }, this);

};
