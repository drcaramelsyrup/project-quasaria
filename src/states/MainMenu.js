/*
 * Main Menu state
 * ===============
 *
 * The player should be able to restart a saved game or start a new game.
 *
 */

'use strict';



//need to figure out how to pass game a
exports.preload = function(game){
  WebFontConfig = {

      //  'active' means all requested fonts have finished loading
      //  We set a 1 second delay before calling 'createText'.
      //  For some reason if we don't the browser cannot render the text the first time it's created.
      active: function() { game.time.events.add(Phaser.Timer.SECOND, createText(game), this); },

      //  The Google Fonts we want to load (specify as many as you like in the array)
      google: {
        families: ['Orbitron']
      }

  };



   game.load.script('webfont', '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js');
}


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
        font: "65px Arial",
        fill: "#ff0044",
        align: "center"
    });

};

function createText(game){

  var text = game.add.text(game.world.centerX, game.world.centerY, "- phaser -\nrocking with\ngoogle web fonts");
    text.anchor.setTo(0.5);

    text.font = 'Orbitron';
    text.fontSize = 60;

    //  x0, y0 - x1, y1
    var textGrad = text.context.createLinearGradient(0, 0, 0, text.canvas.height);
    textGrad.addColorStop(0, '#8ED6FF');
    textGrad.addColorStop(1, '#004CB3');
    text.fill = textGrad;

    text.align = 'center';
    text.stroke = '#000000';
    text.strokeThickness = 2;
    text.setShadow(5, 5, 'rgba(0,0,0,0.5)', 5);

    text.inputEnabled = true;

    text.events.onInputOver.add(function () {
      text.fill = '#ff00ff';
    }, this);
    text.events.onInputOut.add(function(){
      text.fill = textGrad;
    }, this);

    text.events.onInputDown.add(function(){
      console.log("you loaded game.");
      let resumeGame = true;
      game.state.start('Game', true, false, resumeGame);
    }, this);

}
