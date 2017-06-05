/*
 * `states` module
 * ===============
 *
 * Declares all present game states.
 * Expose the required game states using this module.
 */

'use strict';

exports.Boot = require('./Boot');
exports.Preloader = require('./Preloader');
exports.MainMenu = require('./MainMenu');
exports.Game = require('./Game');
exports.Battleground = require('./Battleground');
exports.GameOver = require('./GameOver');