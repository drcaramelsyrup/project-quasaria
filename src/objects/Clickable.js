/*
* Clickable
* ====
*
* A sample prefab (extended game object class), displaying a clickable object in a room.
*/

'use strict';

var Toast = require('./Toast');
var items = require('../../static/assets/items.json');

function Clickable(game, x, y, id, height, width) {
  Phaser.Sprite.call(this, game, x, y, id);
  this.height = height;
  this.width = width;

  this._game = game;
  this.id = id;
  this.name = items[this.id]['name'];
  this.anchor.set(0.5);
  this.alpha = 0.5;
  this.inputEnabled = true;
  this.input.useHandCursor = true;
  this.events.onInputDown.add(click, this);
  this.events.onInputOver.add(mouseover, this);
  this.events.onInputOut.add(mouseout, this);

  this.input.pixelPerfectOver = true;   // checks pixels so that collision only happens with non-transparent areas
                                        // computationally expensive, but maybe necessary for realism purposes?
}

function click() {
  this.destroy();
  this._game.add.existing(new Toast(this._game, 'You\'ve acquired ' + this.name + '!', 5));
  this._game.player.inventory.push(this.id);
  var items = this._game.room.area.items;
  var remove_item = -1;
  //because it is checking the id of the item and not the actual item
  for (let i = 0; i < items.length; i++) {
    if (items[i].id === this.id){
      remove_item = i;
    }
  }
  if (remove_item > -1) {
    items.splice(remove_item, 1);
  } else {
    console.log('unexpected error, please check');
  }
  console.log('Click log', this._game.room.area.items);
  this._game.dialogueWindow.display(); // refresh dialogue display
  this._game.memoryBankWindow.display();  // refresh memory bank display
}

function mouseover() {
  this.alpha = 1;
  this._game.add.existing(this.toast = new Toast(this._game, this.name, 5));
}

function mouseout() {
  if (this.toast) {
    this.toast.toast.container.displayGroup.removeAll();
    this.toast.destroy();
  }
}

Clickable.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = Clickable.prototype.constructor = Clickable;
