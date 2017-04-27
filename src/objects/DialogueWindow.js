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
  this._dialogTextOriginX = 96;
  this._dialogTextOriginY = 60;
  this._dialogPadding = 32;

  // speaker avatar display
  game.slickUI.add(this.avatar = new SlickUI.Element.DisplayObject(
    400, 100, game.make.sprite(0, 0, 'invisible'),
    400, 500));

  // dialogue window dimensions
  this.dialogHeight = game.height * 3 / 8 /* 3/8 height */ - this._dialogPadding / 2;
  this.dialogWidth = game.width - this._dialogPadding;

  // dialog text dimensions (private)
  this._dialogTextHeight = this.dialogHeight - this._dialogTextOriginY - 18;
  this._dialogTextWidth = this.dialogWidth - 185;

  // window coordinates
  var dialogX = this._dialogPadding / 2;
  var dialogY = game.height * 5 / 8;  // 5/8 down

  game.slickUI.add(
    this.dialogPanel = new SlickUI.Element.DisplayObject(
      dialogX, dialogY, game.make.sprite(0,0, 'dialogue-panel'),
      this.dialogWidth, this.dialogHeight));
  this.dialogPanel.displayObject.width = this.dialogWidth;
  this.dialogPanel.displayObject.height = this.dialogHeight;

  // actual window contents
  var speakerX = this._dialogPadding + 64;
  var speakerY = this._dialogPadding / 4;
  var speakerStyle = { font: '20px Goudy Bookletter 1911', fill: '#48f2ff', wordWrap: false, align: 'left' };
  this.dialogPanel.add(
    this.speakerText = new SlickUI.Element.DisplayObject(
      Math.round(speakerX), speakerY, 
      game.make.text(0, 0, 'Speaker', speakerStyle)));
  
  // using a mask for scrolling purposes
  this._scrollMask = game.make.graphics(0, 0);
  this._scrollMask.beginFill(0xffffff);
  this._scrollMask.drawRect( this._dialogTextOriginX, this._dialogTextOriginY, this._dialogTextWidth, this._dialogTextHeight );
  this._scrollMask.endFill();

  var style = { font: '14px Open Sans', fill: '#48f2ff', wordWrap: true, wordWrapWidth: this._dialogTextWidth, align: 'left' };
  this.dialogPanel.add(
    this.dialogText = new SlickUI.Element.DisplayObject(this._dialogTextOriginX, this._dialogTextOriginY, game.make.text(0, 0, 'placeholder text', style)));
  this.dialogText.displayObject.lineSpacing = 0;

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

  //for keeping track of whether the avatar needs to be updated (performance intensive)
  this.avatarName = 'invisible';

}

DialogueWindow.prototype = Object.create(Phaser.Group.prototype);
DialogueWindow.prototype.constructor = DialogueWindow;

DialogueWindow.prototype.begin = function(jsonKey) {
  this.convoManager.loadJSONConversation(jsonKey);
  this.show();
  this.display();
};

DialogueWindow.prototype.display = function() {
  this.cleanWindow();
  this.takeActions();
  this.displayAvatar();
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

DialogueWindow.prototype.takeActions = function() {
  this.convoManager.takeActions(this._game);
};

// if avatar needs to change, fade out the current one and fade in the new one
DialogueWindow.prototype.displayAvatar = function() {
  var speaker = this.convoManager.getAvatar();
  var fadeOut = 200;
  var fadeIn = 200;
  if (speaker !== this.avatarName) {
    var fadeInTween = this._game.add.tween(this.avatar);
    fadeInTween.to({alpha: 0}, fadeOut, Phaser.Easing.Linear.None, true);
    fadeInTween.onComplete.add(function() {
      this.avatar.displayObject.loadTexture(speaker);
      this._game.add.tween(this.avatar).to({alpha: 1}, fadeIn, Phaser.Easing.Linear.None, true);
    }, this);
    this.avatarName = speaker;
  }
};

DialogueWindow.prototype.displayText = function () {  
  this.dialogText.displayObject.text = this.convoManager.getCurrentText();
  this.speakerText.displayObject.text = this.convoManager.getSpeaker().toUpperCase();
};

DialogueWindow.prototype.displayResponses = function () {
  // start rendering buttons at the bottom of dialogue
  var responses = this.convoManager.getResponses(this._game);

  var textBottom = this._dialogTextOriginY + this.dialogText.displayObject.getBounds().height;
  var nextButtonY = textBottom;

  if (responses.length === 0) {
    // no responses - waiting on player to do something to progress
    var waitButton = this.addChoiceButton(this._dialogTextOriginX, nextButtonY,
      'END', null);
    waitButton.visible = false;
    this.buttons.push(waitButton);
  }

  for (var i = 0; i < responses.length; i++) {
    var button = this.addChoiceButton(
      this._dialogTextOriginX, nextButtonY, 
      responses[i]['text'], responses[i]['target']);

    // keep track of buttons to be deleted
    this.buttons.push(button);
    // useful for overflow scrolling
    this._buttonsY.push(button.y);
    nextButtonY += button.sprite.height;
  }

  // last element is bottom of content
  this._buttonsY.push(nextButtonY);
};

DialogueWindow.prototype.addChoiceButton = function (x, y, responseTextField, responseTarget) {
  // display text
  var buttonSidePadding = 32;
  var buttonTextStyle = { font: '14px Open Sans', fill: '#48f2ff', wordWrap: true, wordWrapWidth: this._dialogTextWidth - buttonSidePadding, align: 'left' };
  var responseText = this._game.make.text(0, 0, responseTextField, buttonTextStyle);
  var buttonText = new SlickUI.Element.DisplayObject(
    Math.round(this._dialogTextWidth / 2 - responseText.width / 2),0, /* center text */
    responseText);

  // add to sized button
  var choiceButton;
  this.dialogPanel.add(choiceButton = new SlickUI.Element.DisplayObject(
    x, y, 
    this._game.make.button(0,0, 'choice-button'),
    this.dialogWidth, responseText.height));
  choiceButton.add(buttonText);
  choiceButton.sprite.width = this._dialogTextWidth;
  choiceButton.sprite.height = responseText.height;

  // end of conversation. action deletes window
  if (responseTarget < 0) {
    choiceButton.events.onInputUp.add(
      function () {
        this.dialogueWindow.hide();
        this.dialogueWindow.convoManager.endConversation();  // take any actions that trigger when this conversation ends
      }, {dialogueWindow: this});
  }

  choiceButton.events.onInputUp.add(
    function () {
      this.dialogueWindow.convoManager.idx = this.responseTarget;
      this.dialogueWindow.display();
    }, {dialogueWindow: this, responseTarget: responseTarget});
  // add mask
  choiceButton.sprite.mask = this._scrollMask;
  buttonText.displayObject.mask = this._scrollMask;

  return choiceButton;
};

DialogueWindow.prototype.addOverflowScroll = function () {
  // can we fit everything in the current window?
  var heightDiff = this._buttonsY[this._buttonsY.length - 1]
    - (this._dialogTextOriginY + this._dialogTextHeight);
  // add a slider otherwise
  if (heightDiff > 0) {
    this.slider = new SlickUI.Element.Slider(
      this._dialogTextOriginX + this._dialogTextWidth + this._dialogPadding, 
      this._dialogTextOriginY, 
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

DialogueWindow.prototype.hideAvatar = function() {
  var fadeOutTween = this._game.add.tween(this.avatar);
  var fadeOut = 200;
  fadeOutTween.to({alpha: 0}, fadeOut, Phaser.Easing.Linear.None, true);
};

DialogueWindow.prototype.show = function() {
  this.dialogPanel.visible = true;
};

DialogueWindow.prototype.hide = function () {
  this.cleanWindow();
  //this.visible = false;
  this.dialogPanel.visible = false;
  this.hideAvatar(); //hide avatar
};

DialogueWindow.prototype.update = function () {
  // TODO: Stub.
};