/*
 * Room
 * ====
 *
 * A sample prefab (extended game object class), displaying a room background.
 */

'use strict';

var Clickable = require('../objects/Clickable');
var Placeable = require('../objects/Placeable');
var NPC = require('../objects/NPC');
var areas = require('../../static/assets/areas.json');

function Room(game, room) {
  this._game = game;

  this.area = areas[room];
  this.items = [];
  this.placeables = [];
  this.npcs = [];
  Phaser.Sprite.call(this, game, game.world.centerX, game.world.centerY, this.area['bg']);
  this.anchor.set(0.5);
}

Room.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = Room.prototype.constructor = Room;

Room.prototype.addItems = function() {
  for (var i = 0; i < this.area['items'].length; i++) {
    var item = this.area['items'][i];
    this._game.add.existing(item = new Clickable(this._game, item['x'], item['y'], item['id'], item['height'], item['width']));
    this.items.push(item);
  }
  for (i = 0; i < this.area['placeables'].length; i++) {
    var placeable = this.area['placeables'][i];
    this._game.add.existing(placeable = new Placeable(this._game, placeable['x'], placeable['y'], placeable['id'], placeable['height'], placeable['width']));
    this.placeables.push(placeable);
  }
  for (i = 0; i < this.area['npcs'].length; i++) {
    var npc = this.area['npcs'][i];
    this._game.add.existing(npc = new NPC(this._game, npc['x'], npc['y'], npc['id'], npc['height'], npc['width']));
    this.npcs.push(npc);
  }
};

Room.prototype.clearItems = function() {
  for (var i = 0; i < this.items.length; i++) {
    this.items[i].destroy();
  }
  for (i = 0; i < this.placeables.length; i++) {
    this.placeables[i].destroy();
  }
  for (i = 0; i < this.npcs.length; i++) {
    this.npcs[i].destroy();
  }
  this.items = [];
  this.placeables = [];
  this.npcs = [];
};

Room.prototype.loadArea = function(area) {
  this.area = areas[area];
  this._game.camera.fade('#000000', 2000);
  this._game.camera.onFadeComplete.addOnce(function() {
    this.clearItems();
    this._game.camera.flash('#000000', 2000);
    this.loadTexture(this.area['bg']);
    this.addItems();
  }, this);
};
