/*
* Main Menu state
* ===============
*
* The player should be able to restart a saved game or start a new game.
*
*/

'use strict';

export default class MainMenu extends Phaser.State {

  create() {
    /**
     * MUSIC 
     */
    // if not abstract falsy (neither undefined nor null)
    if (this.music != null)
      this.music.fadeOut(1000); // fade out previous music
    this.music = this.sound.play('menu-theme-terraform');
    this.music.loopFull(1);

    /**
     * SCREEN
     */

    let screen = this.add.sprite(this.world.centerX, this.world.centerY, 'menu_screen');
    screen.anchor.setTo(0.5, 0.5);

    let logo = this.add.sprite(this.world.centerX, this.world.centerY - 30, 'quasaria-logo-MM');
    logo.anchor.setTo(0.5, 0.5);
    logo.alpha = .1;

    /**
     * TEXT
     */

    let screenFont = 'Cinzel Decorative';
    let fillColor = '#42dff4';

    let titleText = this.add.text(this.world.centerX, this.world.centerY- 75, 'Quasaria', {
      font: '75px ' + screenFont,
      fontWeight: 'bold',
      fill: fillColor,
      align: 'center'
    });

    let contText = this.add.text(this.world.centerX, this.world.centerY, 'Continue', {
      font: '50px ' + screenFont,
      fill: fillColor,
      align: 'center'
    });

    let newGameText = this.add.text(this.world.centerX, this.world.centerY + 55, 'New Game', {
      font: '50px ' + screenFont,
      fill: fillColor,
      align: 'center'
    });

    titleText.anchor.setTo(0.5, 0.5);
    contText.anchor.setTo(0.5, 0.5);

    /**
     * INTERACTIVITY
     */
    contText.inputEnabled = true;
    contText.events.onInputOver.add(() => {
      contText.fill = '#ff00ff';
    });

    contText.events.onInputOut.add(() => {
      contText.fill = '#42dff4';
    });

    contText.events.onInputDown.add(() => {
      let resumeGame = true;
      this.state.start('Game', true, false, this, resumeGame);
    });

    newGameText.anchor.setTo(0.5, 0.5);
    newGameText.inputEnabled = true;
    newGameText.events.onInputOver.add(() => {
      newGameText.fill = '#ff00ff';
    });

    newGameText.events.onInputOut.add(() => {
      newGameText.fill = '#42dff4';
    });

    newGameText.events.onInputDown.add(() => {
      let resumeGame = false;
      this.state.start('Game', true, false, this, resumeGame);
    });
  }
};
