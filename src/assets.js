/*
 * `assets` module
 * ===============
 *
 * Declares static asset packs to be loaded using the `Phaser.Loader#pack`
 * method. Use this module to declare game assets.
 */

'use strict';

// -- Splash screen assets used by the Preloader.
exports.boot = [{
  key: 'splash-screen',
  type: 'image'
}, {
  key: 'progress-bar',
  type: 'image'
}];

// -- General assets used throughout the game.
exports.game = [{
  key: 'quasaria-logo',
  type: 'image'
}, {
  key: 'shuttle-bg',
  type: 'image'
}, {
  key: 'listener-obj',
  type: 'image'
}, {
  key: 'note-obj',
  type: 'image'
}, {
  key: 'choice-button',
  type: 'image',
  url: 'ui/choice-button.png'
}, {
  key: 'dialogue-panel',
  type: 'image',
  url: 'ui/dialogue-panel.png'
}, {
  key: 'toast',
  type: 'image',
  url: 'ui/toast.png'
}, {
  key: 'prologue01',
  type: 'json',
  url: 'conversations/prologue01.json'
}, {
  key: 'prologue02',
  type: 'json',
  url: 'conversations/prologue02.json'
}, {
  key: 'mysterious-voice',
  type: 'image',
  url: 'avatars/mysterious-voice.png'
}, {
  key: 'kismet',
  type: 'image',
  url: 'avatars/kismet.png'
}, {
  key: 'gleaming-shoal',
  type: 'image',
  url: 'avatars/gleaming-shoal.png'
}, {
  key: 'invisible',
  type: 'image',
  url: 'avatars/invisible.png'
}];
