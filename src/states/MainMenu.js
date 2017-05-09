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
/*
  var contButton = game.add.button(game.world.centerX, 300, 'continueButton', function(){
    console.log("you loaded game.")
    let resumeGame = true;
    game.state.start('Game', true, false, resumeGame);
  });
*/

  var contText = game.add.text(game.world.centerX, game.world.centerY, "Continue", {
        font: "65px Consolas",
        fill: "#42dff4",
        align: "center"
    });

    var newGameText = game.add.text(game.world.centerX, game.world.centerY + 70, "New Game", {
          font: "65px Consolas",
          fill: "#42dff4",
          align: "center"
      });


    contText.anchor.setTo(0.5, 0.5);
    contText.inputEnabled = true;
    contText.events.onInputOver.add(function() {
    contText.fill = '#ff00ff';
    }, this);

    contText.events.onInputOut.add(function() {
    contText.fill = '#42dff4';
    }, this);

    contText.events.onInputDown.add(function () {
      console.log("you loaded game.")
      let resumeGame = true;
      game.state.start('Game', true, false, resumeGame);
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
      console.log("you loaded game.")
      let resumeGame = false;
      game.state.start('Game', true, false, resumeGame);
    }, this);

};
