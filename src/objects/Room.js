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
  this.name = room;

  this.area = areas[room];
  this.items = [];
  this.placeables = [];
  this.npcs = [];//how does this interact with the conversation manager?
  //this is causing the glitch where the room blinks on load
  //though even a new game blinks
  Phaser.Sprite.call(this, game, game.world.centerX, game.world.centerY, this.area['bg']);
  this.anchor.set(0.5);

}

Room.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = Room.prototype.constructor = Room;

Room.prototype.addItems = function() {
  //would prefer this in load areas TODO restructure
  if (typeof this._game.music !== 'undefined' && this._game.music !== null)
    this._game.music.fadeOut(1000); // fade out previous music
  this._game.music = this._game.sound.play(this.area.music);
  this._game.music.loopFull(1);

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

    var showNPC = true;       // check to see if NPC meets conditions to be shown in this area
    if ('showif' in npc) {
      for (var condition in npc['showif']) {
        if (this._game.player.variables[condition] != npc['showif'][condition]) {
          showNPC = false;
        }
      }
    }
    if (!showNPC) {
      continue; // if NPC doesn't meet conditions to be shown, skip them
    }
    this._game.add.existing(npc = new NPC(this._game, npc['x'], npc['y'], npc['id'], npc['height'], npc['width']));
    if (npc.conv === this._game.player.convoFile){
      npc.alpha = 0;
    }
    // if we want to re-enter a room and talk to a character again
    // then we don't want to pop them off of the stack
    this.npcs.push(npc);
  }
  this._game.world.bringToTop(this._game.slickUI.container.displayGroup);
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
  console.log('in load area');

  //below should track areas seen so that when area transition is pressed
  //it will update with what the specific player has access to.
  if (!this._game.player.seenAreas.includes(area)){
    this._game.player.seenAreas.push(area);
  }
  this.name = area;
  console.log('load area area :)', this);
  this._game.camera.fade('#000000', 2000);
  this._game.camera.onFadeComplete.addOnce(function() {
    this.clearItems();
    this._game.camera.flash('#000000', 2000);
    this.loadTexture(this.area['bg']);
    this.addItems();
  }, this);
};
