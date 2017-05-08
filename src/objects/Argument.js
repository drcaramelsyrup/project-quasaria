'use strict';


function Argument(game, x, y, assetName, match) {
    Phaser.Sprite.call(this, game, x, y, assetName);
    this.inputEnabled = true;
    this.input.useHandCursor = true;
    this.key = match;
}

Argument.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = Argument.prototype.constructor = Argument;