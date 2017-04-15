/*
 * Logo
 * ====
 *
 * A sample prefab (extended game object class), displaying a spinning
 * logo.
 */

'use strict';

function Logo(game, x, y) {
  Phaser.Sprite.call(this, game, x, y, 'quasaria-logo');

  this.anchor.set(0.5);
}
Logo.prototype = Object.create(Phaser.Sprite.prototype);
module.exports = Logo.prototype.constructor = Logo;

Logo.prototype.update = function () {
  this.angle += 0.1;
};
