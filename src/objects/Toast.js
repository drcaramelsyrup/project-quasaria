/*
 * Toast
 * ====
 *
 * A sample prefab (extended game object class), displaying a toast (popup at top of game screen) that displays
 * text and disappears after several seconds.
 */

'use strict';

var textstyles = require('../../static/assets/textstyles.json');

function Toast(game, message, timeout) {
  Phaser.Group.call(this, game);

  this._game = game;
  this.message = message;
  this.timeout = timeout;

  if (game.toast) {
    game.toast.toast.container.displayGroup.removeAll();
    game.toast.destroy();
  }

  // private members specifying margin and padding
  this.toastTextY = 16;

  this.toastHeight = game.height * 1/12;
  this.toastWidth = game.width * 1/2;

  this.toastX = game.width * 1/2 - this.toastWidth * 1/2;
  this.toastY = 8;

  game.slickUI.add(this.toast = new SlickUI.Element.DisplayObject(
    this.toastX, this.toastY, game.make.sprite(0, 0, 'toast'),
    this.toastWidth, this.toastHeight));
  this.toast.displayObject.width = this.toastWidth;
  this.toast.displayObject.height = this.toastHeight;

  game.toast = this;

  this.toast.add(
    this.toastText = new SlickUI.Element.DisplayObject(0, 0, 
      game.make.text(0, this.toastTextY, message, textstyles['toast']))
  );
  this.toastText.displayObject.setTextBounds(0, this.toastTextY, this.toastWidth, this.toastHeight);

  this.toast.alpha = 0.8;

  game.time.events.add(Phaser.Timer.SECOND * timeout, destroyPopup, this);
}

function destroyPopup() {
  this.toast.container.displayGroup.removeAll();
  this.destroy();
}

Toast.prototype = Object.create(Phaser.Group.prototype);
module.exports = Toast.prototype.constructor = Toast;