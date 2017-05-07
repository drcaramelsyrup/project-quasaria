/*
* Player
* ====
*
* The player object class.
*/

'use strict';

function Player(game) {
  Phaser.Group.call(this, game);
//  this.room = null;
  //this._game = game;
  this.inventory = [];
  this.memoryBank = [];
  this.variables = {};
}

Player.prototype = Object.create(Phaser.Group.prototype);
module.exports = Player.prototype.constructor = Player;

Player.prototype.serialize = function(){
  var fields = [
    //'room',
    'inventory',
    'memoryBank',
    'variables'
    //  'roomChanges',
  ];
  console.log(fields);

  var obj = {};

  for (let i in fields){
    let field = fields[i];
    obj[field] = this[field];
  }
//  obj['room'] = this._game.room.area;
  console.log(obj);
  return JSON.stringify(obj);
};

Player.unserialize = function(playerState, game){
  console.log("it can unserialize");

  if (typeof playerState === 'string'){
    console.log(playerState);
    playerState = JSON.parse(playerState, (key, value) => {
    console.log(key); // log the current property name, the last is "".
    return value;     // return the unchanged property value.
  });
  }

  game.player = game.add.existing(new Player(game));
//  playerState['room'] = null;
  //we can figure out if we rehydrate the room here
  for (let field in playerState){
    game.player[field] = playerState[field];
    console.log(playerState[field]);
  }
  console.log(game.player);

};
