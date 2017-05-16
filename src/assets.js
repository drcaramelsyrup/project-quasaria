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

exports.main_menu = [{
  key: 'quasaria-logo-MM',
  type: 'image'
}, {
  key: 'continueButton',
  type: 'image'
}, {
  key: 'menu_screen',
  type: 'image',
  url: 'backgrounds/menu_screen.png'
}];


// -- General assets used throughout the game.
exports.game = [{
  key: 'quasaria-logo',
  type: 'image'
}, {
  key: 'saveButton',
  type: 'image'
}, {
  key: 'shuttle',
  type: 'image',
  url: 'backgrounds/shuttle.png'
}, {
  key: 'hangar',
  type: 'image',
  url: 'backgrounds/hangar.png'
}, {
  key: 'listener',
  type: 'image',
  url: 'items/listener.png'
}, {
  key: 'note',
  type: 'image',
  url: 'items/note.png'
}, {
  key: 'shuttle-placeable',
  type: 'image',
  url: 'items/shuttle-placeable.png'
}, {
  key: 'vesper-npc',
  type: 'image',
  url: 'npcs/vesper.png'
}];

// -- UI-specific assets.
exports.ui = [{
  key: 'dialogue-choice-button',
  type: 'image',
  url: 'ui/dialogue-choice-button.png'
}, {
  key: 'dialogue-panel',
  type: 'image',
  url: 'ui/dialogue-panel.png'
}, {
  key: 'toast',
  type: 'image',
  url: 'ui/toast.png'
}, {
  key: 'memory-bank-button',
  type: 'image',
  url: 'ui/memory-bank-button.png'
}, {
  key: 'memory-bank-icon',
  type: 'image',
  url: 'ui/memory-bank-icon.png'
}, {
  key: 'memory-bank-icon-mask',
  type: 'image',
  url: 'ui/memory-bank-icon-mask.png'
}, {
  key: 'memory-bank-next',
  type: 'image',
  url: 'ui/memory-bank-next.png'
}, {
  key: 'memory-bank',
  type: 'image',
  url: 'ui/memory-bank.png'
}];

// -- Conversation jsons and avatars.
exports.conversations = [{
  key: 'prologue01',
  type: 'json',
  url: 'conversations/prologue01.json'
}, {
  key: 'prologue02',
  type: 'json',
  url: 'conversations/prologue02.json'
}, {
  key: 'vesper01',
  type: 'json',
  url: 'conversations/vesper01.json'
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
  key: 'unknown-alien',
  type: 'image',
  url: 'avatars/gleaming-shoal-silhouette.png'
}, {
  key: 'vesper',
  type: 'image',
  url: 'avatars/vesper.png'
}, {
  key: 'invisible',
  type: 'image',
  url: 'avatars/invisible.png'
}];

// -- Sound effects and background music
exports.sounds = [{
  key: 'sunrise-from-orbit',
  type: 'audio',
  urls: ['music/Sunrise From Orbit (Demo).mp3']
}, {
  key: 'minor-arpeggio',
  type: 'audio',
  urls: ['music/Minor Arpeggio Thing (Demo).mp3']
}, {
  key: 'far-from-home',
  type: 'audio',
  urls: ['music/Far From Home (Demo).mp3']
}, {
  key: 'ukulele',
  type: 'audio',
  urls: ['music/Ukulele (Demo).mp3']
}];

// --logic battle placeholder images

exports.logic_battle = [{
  key: 'alien-stare',
  type: 'image'
}, {
  key: 'greek-sphinx',
  type: 'image'
}, {
  key: 'cyborg-face',
  type: 'image'
}, {
  key: 'curly-mask',
  type: 'image'
}, {
  key: 'lunar-module',
  type: 'image'
}, {
  key: 'fencer',
  type: 'image'
}, {
  key: 'new-born',
  type: 'image'
}, {
  key: 'saint-basil-cathedral',
  type: 'image'
}, {
  key: 'goblin-head',
  type: 'image'
}];
