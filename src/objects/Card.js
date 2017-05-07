'use strict';


function Card(game, x, y, assetName) {
    Phaser.Sprite.call(this, game, x, y, assetName);
    this.inputEnabled = true;
    this.input.useHandCursor = true;
    this.key = assetName;
    this.description = "test";
}

Card.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = Card.prototype.constructor = Card;