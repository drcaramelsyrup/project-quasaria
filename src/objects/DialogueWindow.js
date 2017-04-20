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
  // messy, but useful if we need a reference to the game
  this._game = game;

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
  
  // using a mask for scrolling purposes
  this._scrollMask = game.make.graphics(0, 0);
  this._scrollMask.beginFill(0xffffff);
  this._scrollMask.drawRect( this._dialogTextOriginX, this._dialogTextOriginY, this._dialogTextWidth, this._dialogTextHeight );
  this._scrollMask.endFill();

  var style = { font: '14px Open Sans', fill: '#000000', wordWrap: true, wordWrapWidth: this._dialogTextWidth, align: 'left' };
  this.dialogPanel.add(
    this.dialogText = new SlickUI.Element.DisplayObject(this._dialogTextOriginX, this._dialogTextOriginY, game.make.text(0, 0, 'placeholder text', style)));

  this.dialogPanel.add(new SlickUI.Element.DisplayObject(0, 0, this._scrollMask));
  this.dialogText.displayObject.mask = this._scrollMask;

  this.dialogPanel.alpha = 0.8;

  // for removing player choice buttons
  this.buttons = [];
  // slider for scrolling overflow
  this.slider = null;
  // stores each button Y value
  // also keeps track of how low our content goes; last element is content bottom
  this._buttonsY = [];

}

DialogueWindow.prototype = Object.create(Phaser.Group.prototype);
DialogueWindow.prototype.constructor = DialogueWindow;

DialogueWindow.prototype.begin = function(jsonKey) {
  this.convoManager.loadJSONConversation(this._game, jsonKey);
  this.display();
};

DialogueWindow.prototype.display = function() {
  this.cleanWindow();
  this.displayText();
  this.displayResponses();
  this.addOverflowScroll();
};

DialogueWindow.prototype.cleanWindow = function () {
  // remove all buttons
  for (var i = 0; i < this.buttons.length; i++) {
    var button = this.buttons[i];
    button.container.displayGroup.removeAll(true);
    button.container.displayGroup.destroy();
    button.container.children = [];
    button.container = undefined;
    button.sprite = undefined;
  }
  this.buttons = [];
  this._buttonsY = [];

  // remove scroller and restore dialog text position
  if (this.slider !== null) {
    this.slider.displayGroup.removeAll(true);
  }
  this.dialogText.y = this._dialogTextOriginY;
};

DialogueWindow.prototype.displayText = function () {  
  this.dialogText.displayObject.text = this.convoManager.getCurrentText();
  this.speakerText.value = this.convoManager.getSpeaker();
};

DialogueWindow.prototype.displayResponses = function () {
  // start rendering buttons at the bottom of dialogue
  var responses = this.convoManager.getResponses();

  var textBottom = this._dialogTextOriginY + this.dialogText.displayObject.getBounds().height;
  var nextButtonY = textBottom;
  for (var i = 0; i < responses.length; i++) {
    // display text
    var buttonTextStyle = { font: '14px Open Sans', fill: '#000000', wordWrap: true, wordWrapWidth: this._dialogTextWidth, align: 'left' };
    var responseText = this._game.make.text(0, 0, responses[i]['text'], buttonTextStyle);
    var buttonText = new SlickUI.Element.DisplayObject(
      Math.round(this.dialogWidth / 2 - responseText.width / 2),0, /* center text */
      responseText);

    // add to sized button
    var choiceButton;
    this.dialogPanel.add(choiceButton = new SlickUI.Element.Button(
      0,nextButtonY, 
      this.dialogWidth, responseText.height));
    choiceButton.add(buttonText);
    nextButtonY += responseText.height;
    // useful for overflow scrolling
    this._buttonsY.push(choiceButton.y);

    var responseTarget = responses[i]['target'];
    choiceButton.events.onInputUp.add(
      function () {
        this.dialogueWindow.convoManager.idx = this.responseTarget;
        this.dialogueWindow.display();
      }, {dialogueWindow: this, responseTarget: responseTarget});
    // add mask
    choiceButton.sprite.mask = this._scrollMask;
    buttonText.displayObject.mask = this._scrollMask;
    // keep track of buttons to be deleted
    this.buttons.push(choiceButton);
  }

  // last element is bottom of content
  this._buttonsY.push(nextButtonY);
};

DialogueWindow.prototype.addOverflowScroll = function () {
  // can we fit everything in the current window?
  var heightDiff = this._buttonsY[this._buttonsY.length - 1] - this._dialogTextHeight;
  // add a slider otherwise
  if (heightDiff > 0) {
    this.slider = new SlickUI.Element.Slider(
      this._dialogTextWidth + this._dialogPadding, this._dialogPadding, 
      this._dialogTextHeight, 1 /* scrollbar starts at top, or 1; bottom is 0 */, true /* vertical */);
    this.dialogPanel.add(this.slider);

    this.slider.onDrag.add(function (value) {
      // mapping height differences to scroll values
      var scrollValue = heightDiff*(1-value);
      this.dialogText.y = this._dialogTextOriginY - scrollValue;
      for (var i = 0; i < this.buttons.length; i++) {
        // slide all buttons up
        this.buttons[i].y = this.dialogPanel.y + this._buttonsY[i] - scrollValue;
      }
    }, this);
  }
};

DialogueWindow.prototype.next = function() {
  this.convoManager.idx++;
  this.display();
};

DialogueWindow.prototype.update = function () {
  // TODO: Stub.
};