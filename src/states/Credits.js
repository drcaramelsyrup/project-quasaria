/*
* Credits state
* =============
*
* The player should be able to return to the main menu.
*
*/

'use strict';

exports.init = function(game) {
  this.description = 'Congratulations! You\'ve reached the end of our playable demo. \
  We hope you enjoyed the first chapter of Quasaria as much as we enjoyed making it!';
  this.credits = 'Developed by:\nAlexandros Christodoulou-Rubalcava\nHana Lee\nAmber Thomas\nEdward Wang';
};

exports.create = function (game) {
  this.camera.flash('#000000', 2000);

  //might not be in quotes, its an issue below
  var screen = game.add.sprite(game.world.centerX, game.world.centerY, 'menu_screen');
  screen.anchor.setTo(0.5, 0.5);

  let screenFont = 'Cinzel Decorative';
  let fillColor = '#42dff4';

  var descText = game.add.text(game.world.centerX, game.world.centerY - 100, this.description, {
    font: '16px ' + screenFont,
    fill: fillColor,
    align: 'center',
    wordWrap: true,
    wordWrapWidth: game.width - 300
  });

  var creditsText = game.add.text(game.world.centerX, game.world.centerY + 120, this.credits, {
    font: '16px ' + screenFont,
    fill: fillColor,
    align: 'center',
    wordWrap: true,
    wordWrapWidth: game.width - 300
  });

  var mainMenuText = game.add.text(game.world.centerX, game.world.centerY, 'Main Menu', {
    font: '50px ' + screenFont,
    fill: fillColor,
    align: 'center'
  });

  descText.anchor.setTo(0.5, 0.5);
  creditsText.anchor.setTo(0.5, 0.5);

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
