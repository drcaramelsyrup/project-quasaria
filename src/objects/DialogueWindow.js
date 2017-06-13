/*
* DialogueWindow
* ==============
*
* Handles displaying dialogue (conversation data) to screen
*/

'use strict';

module.exports = DialogueWindow;

var Scrollbar = require('./Scrollbar');
var textstyles = require('../../static/assets/textstyles.json');

function DialogueWindow(game, convoManager/*, ...args*/) {
  Phaser.Group.call(this, game/*, ...args*/);

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

  /* SIGNALS */
  // private
  this._onDialogTextFinished = new Phaser.Signal(); // when the char-by-char display finishes

  // private members specifying margin and padding
  this._dialogTextOriginX = 96;
  this._dialogTextOriginY = 60;
  this._dialogPadding = 32;

  // speaker avatar display
  game.slickUI.add(this.avatar = new SlickUI.Element.DisplayObject(
    400, 100, game.make.sprite(0, 0, 'invisible'),
    400, 500));

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
  this.dialogPanel.add(
    this.speakerText = new SlickUI.Element.DisplayObject(
      Math.round(speakerX), speakerY,
      game.make.text(0, 0, 'Speaker', textstyles['speaker'])));

  // using a mask for scrolling purposes
  this._scrollMask = game.make.graphics(0, 0);
  this._scrollMask.beginFill(0xffffff);
  this._scrollMask.drawRect( this._dialogTextOriginX, this._dialogTextOriginY, this._dialogTextWidth, this._dialogTextHeight );
  this._scrollMask.endFill();

  var bodyStyle = textstyles['dialogueBody'];
  bodyStyle.wordWrapWidth = this._dialogTextWidth;
  this.dialogPanel.add(
    this.dialogText = new SlickUI.Element.DisplayObject(this._dialogTextOriginX, this._dialogTextOriginY, 
      game.make.text(0, 0, 'placeholder text', bodyStyle)));
  this.dialogText.displayObject.lineSpacing = 0;

  this.dialogPanel.add(new SlickUI.Element.DisplayObject(0, 0, this._scrollMask));
  this.dialogText.displayObject.mask = this._scrollMask;

  this.dialogPanel.alpha = 0.8;

  // for removing player choice buttons
  this.buttons = [];
  this.buttonTweens = [];
  // slider for scrolling overflow
  this.slider = null;
  // stores each button Y value
  // also keeps track of how low our content goes; last element is content bottom
  this._buttonsY = [];

  //for keeping track of whether the avatar needs to be updated (performance intensive)
  this.avatarName = 'invisible';

  // will track the conversation file, so that save checkpoints will
  // go to the correct area in the conversation
  this.convoFile = null;

  // for rendering lines character by character
  this.charTimer = null;
}

DialogueWindow.prototype = Object.create(Phaser.Group.prototype);
DialogueWindow.prototype.constructor = DialogueWindow;

DialogueWindow.prototype.begin = function(jsonKey) {
  if (jsonKey) {
    this.loadJSONConversation(jsonKey);
    this.show();
    this.display();
  } else {
    this.hide();
  }
};

DialogueWindow.prototype.loadJSONConversation = function (jsonKey) {
  if (jsonKey) {
    this.convoFile = jsonKey;
    this.convoManager.loadJSONConversation(jsonKey);
  }
};

DialogueWindow.prototype.display = function (displaysInstant = false 
                              /* by default, not set to display text instantly */) {
  this.cleanWindow();
  if (this.convoFile) {
    this.takeActions();
    this.displayAvatar();

    // On finishing the dialog text display, display our responses
    // Added before our actual display call in case we display instantly
    this._onDialogTextFinished.add(function () {
      this.displayResponses();
      this._onDialogTextFinished.removeAll();
    }, this);
    this.displayText(displaysInstant);
  }
};

DialogueWindow.prototype.cleanWindow = function () {
  // stop all button tweens
  for (var i = 0; i < this.buttonTweens.length; i++) {
    this.buttonTweens[i].stop();
  }

  // remove all buttons
  for (var j = 0; j < this.buttons.length; j++) {
    var button = this.buttons[j];
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
    this.slider.destroy();
    this.slider = null;
  }
  this.dialogText.y = this._dialogTextOriginY;
  this.dialogText.displayObject.inputEnabled = false;
  this.dialogText.displayObject.events.onInputOver.removeAll();
  this.dialogText.displayObject.events.onInputOut.removeAll();
  this._game.input.mouse.mouseWheelCallback = null;
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

DialogueWindow.prototype.displayText = function (displaysInstant) {
  this.speakerText.displayObject.text = this.convoManager.getSpeaker().toUpperCase();
  this.dialogText.displayObject.mask = this._scrollMask;

  if (displaysInstant) {
    this.dialogText.displayObject.text = this.convoManager.getCurrentText();
    if (this.charTimer != null) {
      this._game.time.events.remove(this.charTimer);  // stop characters from rendering one by one, if they are currently rendering
    }
    this._onDialogTextFinished.dispatch();
    return;
  }

  // character-by-character display
  this.displayCurrentLine();
  
};

DialogueWindow.prototype.displayResponses = function () {
  // start rendering buttons at the bottom of dialogue
  var responses = this.convoManager.getResponses(this._game);

  var textBottom = this._dialogTextOriginY + this.dialogText.displayObject.getBounds().height;
  this.nextButtonY = textBottom;

  if (responses.length === 0) {
    // no responses - waiting on player to do something to progress
    var waitButton = this.addChoiceButton(this._dialogTextOriginX, this.nextButtonY,
      'END', null);
    waitButton.visible = false;
    this.buttons.push(waitButton);
  }

  this.buttonTweens = [];

  for (var i = 0; i < responses.length; i++) {
    // pass along special parameters, if any
    var params = [];
    if ('params' in responses[i]) {
      params = responses[i]['params'];
    }

    // keep track of buttons to be deleted
    var responseDelay = 250;
    var button = this.addChoiceButton(
      this._dialogTextOriginX, this.nextButtonY,
      responses[i]['text'], responses[i]['target'], params);
    button.alpha = 0;
    var tween = this._game.add.tween(button).to({alpha: 1}, responseDelay, Phaser.Easing.Linear.None, true, responseDelay * i);
    if (i === responses.length - 1) {
      tween.onComplete.add(function() {
        this.addOverflowScroll();
      }, this);
    }
    this.buttonTweens.push(tween);  // for deletion later
    this.buttons.push(button);
    this._buttonsY.push(button.y);
    this.nextButtonY += button.sprite.height;
  }

  // last element is bottom of content
  this._buttonsY.push(this.nextButtonY);
};

DialogueWindow.prototype.addChoiceButton = function (x, y, responseTextField, responseTarget, responseParams = []) {
  // display text
  var buttonSidePadding = 32;
  var buttonTextStyle = textstyles['choiceButton'];
  buttonTextStyle.wordWrapWidth = this._dialogTextWidth - buttonSidePadding;
  var responseText = this._game.make.text(0, 0, responseTextField, buttonTextStyle);
  var buttonText = new SlickUI.Element.DisplayObject(
    Math.round(this._dialogTextWidth / 2 - responseText.width / 2),0, /* center text */
    responseText);

  // add to sized button
  var choiceButton;
  this.dialogPanel.add(choiceButton = new SlickUI.Element.DisplayObject(
    x, y,
    this._game.make.button(0,0, 'dialogue-choice-button'),
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
      var shouldRefresh = this.dialogueWindow.convoManager.advanceToTarget(
        this.responseTarget, this.responseParams);
      if (shouldRefresh)
        this.dialogueWindow.display();
    }, {dialogueWindow: this, responseTarget: responseTarget, responseParams: responseParams});
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

    var scrolllineWidth = 1.5;
    this.slider = new Scrollbar(
      this._game,
      this._dialogTextOriginX + this._dialogTextWidth + this._dialogPadding - scrolllineWidth,
      this._dialogTextOriginY - scrolllineWidth,
      this.dialogPanel, // parent
      {
        'x': [0, this._dialogPadding, 0],
        'y': [0, this._dialogTextHeight / 2, this._dialogTextHeight]
      },
      heightDiff, scrolllineWidth);

    var scrollCallback = function (value) {
      // mapping height differences to scroll values
      var scrollValue = heightDiff*value;
      this.dialogText.y = this._dialogTextOriginY - scrollValue;
      for (var i = 0; i < this.buttons.length; i++) {
        // slide all buttons up
        this.buttons[i].y = this.dialogPanel.y + this._buttonsY[i] - scrollValue;
      }
    };

    this.slider.onDrag.add(scrollCallback, this);
    this.slider.onSetValue.add(scrollCallback, this);

    // Mouse wheel events
    this.dialogText.displayObject.inputEnabled = true;
    this.dialogText.displayObject.events.onInputOver.add(
      function () { this._dialogOver = true; }, this);
    this.dialogText.displayObject.events.onInputOut.add(
      function () { this._dialogOver = false; }, this);
    this._game.input.mouse.mouseWheelCallback = (function (event) {
      if (!this._dialogOver)
        return;
      this.slider.value += (1/heightDiff) * event.deltaY;
    }).bind(this);
  }
};

DialogueWindow.prototype.showAvatar = function() {
  var fadeInTween = this._game.add.tween(this.avatar);
  var fadeIn = 200;
  fadeInTween.to({alpha: 1}, fadeIn, Phaser.Easing.Linear.None, true);
};

DialogueWindow.prototype.hideAvatar = function() {
  var fadeOutTween = this._game.add.tween(this.avatar);
  var fadeOut = 200;
  fadeOutTween.to({alpha: 0}, fadeOut, Phaser.Easing.Linear.None, true);
};

DialogueWindow.prototype.show = function() {
  this.dialogPanel.visible = true;
  this.showAvatar();
};

DialogueWindow.prototype.hide = function () {
  this.cleanWindow();
  this.dialogPanel.visible = false;
  this.hideAvatar(); //hide avatar
};

DialogueWindow.prototype.displayCurrentLine = function () {

  var line = this.convoManager.getCurrentText();
  this.dialogText.displayObject.text = '';

  //  Split the current line on characters, so one char per array element
  var split = line.split('');

  //  Reset the word index to zero (the first word in the line)
  this._cIndex = 0;

  // Add an option to skip the text on clicking down.
  this.dialogPanel.displayObject.inputEnabled = true;
  this.dialogPanel.events.onInputDown.add(this.skipText, this);

  var nextChar = function () {
    // TODO: make this a selectable option
    var delay = 3;
    
    this.dialogText.displayObject.text =
      this.dialogText.displayObject.text.concat(split[this._cIndex]);
    if (split[this._cIndex] === ',') {
      delay = 200;    // brief pause on commas
    } else if (['.', '?', '!'].indexOf(split[this._cIndex]) > -1) {
      delay = 300;    // longer pause after each sentence
    }
    this._cIndex++;
    if (this._cIndex == split.length) {
      // Tell the window when we're done
      this._onDialogTextFinished.dispatch();
      this.charTimer = null;
    } else {
      // Add the next event in the chain
      this.charTimer = this._game.time.events.add(delay, nextChar, this);
    }
  };

  //  Call the 'nextChar' function and chain until it reaches the end of the line
  this.charTimer = this._game.time.events.add(0, nextChar, this);

};

DialogueWindow.prototype.skipText = function () {
  this._game.time.removeAll();
  this.displayText(true);
  this.dialogPanel.events.onInputDown.removeAll();
};

DialogueWindow.prototype.update = function () {
  // TODO: Stub.
};
