/*
* Player
* ====
*
* The player object class.
*/

'use strict';

function Player(game) {
  Phaser.Group.call(this, game);
  this.inventory = [];
  this.memoryBank = [];
  this.variables = {};
  this.currentRoom = null;
  this.convoIdx = 0;
  this.shownConvo = [];
  this.convoFile = null;

}

Player.prototype = Object.create(Phaser.Group.prototype);
module.exports = Player.prototype.constructor = Player;

Player.prototype.serialize = function(game){
  var fields = [
    'inventory',
    'memoryBank',
    'variables'
  ];

  var obj = {};

  for (let i in fields){
    let field = fields[i];
    obj[field] = this[field];
  }
  //since the room info contains all the objects in room, can I pop off there?
  obj['currentRoom'] = game.room.area;
  obj['convoIdx'] = game.dialogueWindow.convoManager.idx;
  obj['shownConvo'] = game.dialogueWindow.convoManager.shown;
  //since the convoFile is not stored in the game, we will just store it with the
  //player whenever a new file is started.
  //or we could store that also in the Dialogue manager??
  obj['convoFile'] = game.dialogueWindow.convoFile;
  console.log("saved object");
  console.log(obj);
  return JSON.stringify(obj);
};

Player.unserialize = function(playerState, game){

  if (typeof playerState === 'string'){
    console.log("unserialized state")
    console.log(playerState);
    playerState = JSON.parse(playerState, (key, value) => {
    console.log(key); // log the current property name, the last is "".
    return value;     // return the unchanged property value.
  });
  }

  game.player = game.add.existing(new Player(game));

  for (let field in playerState){
    game.player[field] = playerState[field];
  }
  console.log(game.player);

};
