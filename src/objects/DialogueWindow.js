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

  // private members specifying margin and padding
  this._dialogTextOriginX = 12;
  this._dialogTextOriginY = 34;
  this._dialogPadding = 32;

  // dialogue window dimensions
  this.dialogHeight = game.height / 3 - this._dialogPadding / 2;
  this.dialogWidth = game.width - this._dialogPadding;

  // dialog text dimensions (private)
  this._dialogTextHeight = this.dialogHeight - 50;
  this._dialogTextWidth = this.dialogWidth - 50;

  // window coordinates
  var dialogX = this._dialogPadding / 2;
  var dialogY = game.height * 2 / 3;  // 1/3 from bottom of screen

  game.slickUI.add(
    this.dialogPanel = new SlickUI.Element.Panel(dialogX, dialogY, this.dialogWidth, this.dialogHeight));

  // actual window contents
  this.dialogPanel.add(
    this.speakerText = new SlickUI.Element.Text(10, 0, 'Speaker')).centerHorizontally().text.alpha = 0.5;
  
  var scrollMask = game.make.graphics(0, 0);
  scrollMask.beginFill(0xffffff);
  scrollMask.drawRect( this._dialogTextOriginX, this._dialogTextOriginY, this._dialogTextWidth, this._dialogTextHeight );
  scrollMask.endFill();

  // this.dialogue
  var style = { font: '14px Arial', fill: '#000000', wordWrap: true, wordWrapWidth: this._dialogTextWidth, align: 'left' };
  this.dialogPanel.add(
    this.dialogText = new SlickUI.Element.DisplayObject(this._dialogTextOriginX, this._dialogTextOriginY, game.make.text(0, 0, 'placeholder text', style)));

  this.dialogPanel.add(new SlickUI.Element.DisplayObject(0, 0, scrollMask));
  this.dialogText.displayObject.mask = scrollMask;

  this.dialogPanel.alpha = 0.8;

  // for removing player choice buttons
  this.buttons = [];

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
  // this.displayResponses();
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
  // this.dialogText.value = this.convoManager.getCurrentText();
  
  this.dialogText.displayObject.text = this.convoManager.getCurrentText();
  if (this.dialogText.displayObject.getBounds().height > this.dialogHeight - 50) {
    var slider = new SlickUI.Element.Slider(
      this._dialogTextWidth + this._dialogPadding, this._dialogPadding, 
      this._dialogTextHeight, 1 /* scrollbar starts at top, or 1; bottom is 0 */, true /* vertical */);
    this.dialogPanel.add(slider);

    var heightDiff = this.dialogText.displayObject.getBounds().height - (this.dialogHeight - 50);
    slider.onDrag.add(function (value) {
      // mapping height differences to scroll values
      this.dialogText.y = this._dialogTextOriginY - heightDiff*(1-value);
    }, this);
  }
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