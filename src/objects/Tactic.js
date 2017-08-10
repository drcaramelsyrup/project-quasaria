'use strict';

var Card = require('./Card');
var tactics = require('../../static/assets/tactics.json');

function Tactic(game, x, y, assetName, multiUse = false) {
  Card.call(this, game, x, y, assetName, multiUse);
}

Tactic.prototype = Object.create(Card.prototype);
module.exports = Tactic.prototype.constructor = Tactic;

/* BEGIN OVERRIDE FUNCTIONS */
Tactic.prototype.getName = function () {
  return tactics[this.key]['name'];
};

Tactic.prototype.getDescription = function () {
  return tactics[this.key]['desc'];
};
/* END OVERRIDE FUNCTIONS */