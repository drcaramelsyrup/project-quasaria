/*
 * DialogueWindow
 * ==============
 *
 * Handles displaying dialogue (conversation data) to screen
 */

'use strict';

module.exports = DialogueWindow;

function DialogueWindow(game/*, ...args*/) {
  Phaser.Group.call(this, game/*, ...args*/);

  // PROPERTIES
  // - dialogPanel
  // - speakerText
  // - dialogText

  // Basic dialogue window
  var dialogPadding = 32;
  var dialogHeight = game.height / 3 - dialogPadding / 2;
  var dialogWidth = game.width - dialogPadding;
  var dialogTextOriginX = 12;
  var dialogTextOriginY = 34;

  var dialogX = dialogPadding / 2;
  var dialogY = game.height * 2 / 3;  // 1/3 from bottom of screen

  game.slickUI.add(
    this.dialogPanel = new SlickUI.Element.Panel(dialogX, dialogY, dialogWidth, dialogHeight));

  // dialogue text
  this.dialogPanel.add(
    this.speakerText = new SlickUI.Element.Text(10, 0, 'Speaker')).centerHorizontally().text.alpha = 0.5;
  this.dialogPanel.add(
    this.dialogText = new SlickUI.Element.Text(dialogTextOriginX, dialogTextOriginY, 'Sample Speech'));

  // with a navigation button!
  var nextButton;
  var nextButtonWidth = 32;
  var nextButtonHeight = 32;
  this.dialogPanel.add(nextButton = new SlickUI.Element.Button(dialogWidth - nextButtonWidth,dialogHeight / 2 - nextButtonHeight / 2, nextButtonWidth, nextButtonHeight));
  nextButton.events.onInputUp.add(function () {console.log('Clicked button');});
  nextButton.add(new SlickUI.Element.Text(0,0, '>')).center();
}
DialogueWindow.prototype = Object.create(Phaser.Group.prototype);
DialogueWindow.prototype.constructor = DialogueWindow;

DialogueWindow.prototype.update = function () {
  // TODO: Stub.
};
