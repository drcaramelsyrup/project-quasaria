/*
 * Clickable
 * ====
 *
 * A sample prefab (extended game object class), displaying a clickable object in a room.
 */

'use strict';

var Toast = require('./Toast');

function Clickable(game, x, y, assetName) {
  Phaser.Sprite.call(this, game, x, y, assetName);

  this._game = game;
  this.id = assetName;
  this.name = mappings[assetName];
  this.anchor.set(0.5);
  this.alpha = 0.5;
  this.inputEnabled = true;
  this.input.useHandCursor = true;
  this.events.onInputDown.add(click, this);
  this.events.onInputOver.add(mouseover, this);

}

function click() {
  this.destroy();
  this._game.add.existing(new Toast(this._game, 'You\'ve acquired ' + this.name + '!', 5));
  //this._game.slickUI.add(this.popup = new SlickUI.Element.Panel(8,8,this._game.width-16,50));
  //this.popup.add(new SlickUI.Element.Text(0,0,"You've acquired " + this.name + "!")).centerHorizontally().centerVertically().text.alpha=0.5;
  //this._game.time.events.add(Phaser.Timer.SECOND * 5, destroyPopup, this);
}

function mouseover() {
  this.alpha = 1;
}

/*function destroyPopup() {
  this.popup.destroy();
}*/

Clickable.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = Clickable.prototype.constructor = Clickable;

//temporary way of mapping asset ids to their player-facing names
var mappings = {
  'listener-obj': 'Listener',
  'note-obj': 'Indecipherable Note'
};