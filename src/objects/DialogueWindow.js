/*
 * DialogueWindow
 * ==============
 *
 * Handles displaying dialogue (conversation data) to screen
 */

'use strict';

module.exports = DialogueWindow;

function DialogueWindow(game, convoManager/*, ...args*/) {
  Phaser.Group.call(this, game, convoManager/*, ...args*/);

  // PROPERTIES
  // - dialogPanel
  // - speakerText
  // - dialogText
  // - convoManager (passed in ConversationManager)
  // - dialogWidth
  // - dialogHeight
  // - buttons

  this.convoManager = convoManager;

  // Basic dialogue window
  var dialogPadding = 32;
  this.dialogHeight = game.height / 3 - dialogPadding / 2;
  this.dialogWidth = game.width - dialogPadding;
  var dialogTextOriginX = 12;
  var dialogTextOriginY = 34;

  var dialogX = dialogPadding / 2;
  var dialogY = game.height * 2 / 3;  // 1/3 from bottom of screen

  game.slickUI.add(
    this.dialogPanel = new SlickUI.Element.Panel(dialogX, dialogY, this.dialogWidth, this.dialogHeight));

  // dialogue text
  this.dialogPanel.add(
    this.speakerText = new SlickUI.Element.Text(10, 0, 'Speaker')).centerHorizontally().text.alpha = 0.5;
  this.dialogPanel.add(
    this.dialogText = new SlickUI.Element.Text(dialogTextOriginX, dialogTextOriginY, 'Sample Speech'));
  this.dialogText.size = 14;
  this.dialogText.reset(this.dialogText.x, this.dialogText.y);

  // past this index, children of this window will be removed
  this.buttons = [];

  // button panel
  // this.dialogPanel.add(
  //   this.buttonPanel = new SlickUI.Element.Panel(0,0, this.dialogWidth, this.dialogHeight));

  // with a navigation button!
  // var nextButton;
  // var nextButtonWidth = 32;
  // var nextButtonHeight = 32;

  // this.dialogPanel.add(nextButton = new SlickUI.Element.Button(
  //   this.dialogWidth - nextButtonWidth,this.dialogHeight / 2 - nextButtonHeight / 2, 
  //   nextButtonWidth, nextButtonHeight));

  // nextButton.events.onInputUp.add(
  //   function () { this.next(); }, this
  // );
  // nextButton.add(new SlickUI.Element.Text(0,0, '>')).center();
}

DialogueWindow.prototype = Object.create(Phaser.Group.prototype);
DialogueWindow.prototype.constructor = DialogueWindow;

DialogueWindow.prototype.begin = function(game, jsonKey) {
  this.convoManager.loadJSONConversation(game, jsonKey);
  this.display();
};

DialogueWindow.prototype.display = function() {
  this.removeButtons();
  this.displayText();
  this.displayResponses();
};

DialogueWindow.prototype.removeButtons = function () {
  for (var i = 0; i < this.buttons.length; i++) {
    var button = this.buttons[i];
    button.container.displayGroup.removeAll(true);
    button.container.displayGroup.destroy();
    button.container.children = [];
    button.container = undefined;
    button.sprite = undefined;
  }
  this.buttons = [];
};

DialogueWindow.prototype.displayText = function () {
  this.dialogText.value = this.convoManager.getCurrentText();
};

DialogueWindow.prototype.displayResponses = function () {
  // pixel width
  var textHeight = this.dialogText.size*1.3;
  // round up number of lines
  var lines = Math.ceil(this.dialogText.value.length * this.dialogText.size / this.dialogWidth);
  var textBottom = this.dialogText.y + lines * textHeight;

  // start rendering buttons at the bottom of dialogue
  var responses = this.convoManager.getResponses();
  for (var i = 0; i < responses.length; i++) {
    var choiceButton;
    this.dialogPanel.add(choiceButton = new SlickUI.Element.Button(0,textBottom + i*this.dialogText.size*1.5, this.dialogWidth, 24));

    var responseTarget = responses[i]['target'];
    choiceButton.events.onInputUp.add(
      function () {
        this.dialogueWindow.convoManager.idx = this.responseTarget;
        this.dialogueWindow.display();
      }, {dialogueWindow: this, responseTarget: responseTarget});

    var buttonText = new SlickUI.Element.Text(0,0, responses[i]['text']);
    buttonText.size = this.dialogText.size;
    choiceButton.add(buttonText).center();
    this.buttons.push(choiceButton);
  }
};

DialogueWindow.prototype.next = function() {
  this.convoManager.idx++;
  this.display();
};

DialogueWindow.prototype.update = function () {
  // TODO: Stub.
};