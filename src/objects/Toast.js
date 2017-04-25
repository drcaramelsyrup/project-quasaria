/*
 * Toast
 * ====
 *
 * A sample prefab (extended game object class), displaying a toast (popup at top of game screen) that displays
 * text and disappears after several seconds.
 */

'use strict';

function Toast(game, message, timeout) {
  Phaser.Group.call(this, game);

  this._game = game;
  this.message = message;
  this.timeout = timeout;
  game.slickUI.add(this.popup = new SlickUI.Element.Panel(8,8,game.width-16,50));
  this.popup.add(new SlickUI.Element.Text(0, 0, message)).centerHorizontally().centerVertically().text.alpha=0.5;
  game.time.events.add(Phaser.Timer.SECOND * timeout, destroyPopup, this);
}

function destroyPopup() {
  this.popup.destroy();
	this.destroy();
}

Toast.prototype = Object.create(Phaser.Group.prototype);
module.exports = Toast.prototype.constructor = Toast;