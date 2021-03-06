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
  url: 'backgrounds/menu_screen_scaled.png'
}];


// -- General assets used throughout the game.
exports.game = [{
  key: 'quasaria-logo',
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
  key: 'medbay',
  type: 'image',
  url: 'backgrounds/medbay.png'
}, {
  key: 'listener',
  type: 'image',
  url: 'items/listener.png'
}, {
  key: 'note',
  type: 'image',
  url: 'items/note.png'
}, {
  key: 'biologistApproval',
  type: 'image',
  url: 'avatars/talvine.png'
}, {
  key: 'psychologistApproval',
  type: 'image',
  url: 'avatars/valken.png'
}, {
  key: 'shuttle-placeable',
  type: 'image',
  url: 'items/shuttle-placeable.png'
}, {
  key: 'vesper-npc',
  type: 'image',
  url: 'npcs/vesper.png'
}, {
  key: 'talvine-npc',
  type: 'image',
  url: 'npcs/talvine.png'
}, {
  key: 'valken-npc',
  type: 'image',
  url: 'npcs/valken.png'
}, {
  key: 'gleaming-shoal-npc',
  type: 'image',
  url: 'npcs/gleaming-shoal.png'
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
}, {
  key: 'saveButton',
  type: 'image'
}, {
  key: 'button',
  type: 'image',
  url: 'ui/button.png'
}, {
  key: 'battle-background',
  type: 'image',
  url: 'ui/battle-background.png'
}, {
  key: 'battle-overlay',
  type: 'image',
  url: 'ui/battle-overlay-scaled.png'
}, {
  key: 'memory-bank-icon-fill',
  type: 'image',
  url: 'ui/memory-bank-icon-fill.png'
}, {
  key: 'companion-icon',
  type: 'image',
  url: 'ui/companion-icon.png'
}, {
  key: 'enemy-arg-icon',
  type: 'image',
  url: 'ui/enemy-arg-icon.png'
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
  key: 'talvine01',
  type: 'json',
  url: 'conversations/talvine01.json'
}, {
  key: 'valken01',
  type: 'json',
  url: 'conversations/valken01.json'
}, {
  key: 'gleaming-shoal01',
  type: 'json',
  url: 'conversations/gleaming-shoal01.json'
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
  key: 'gleaming-shoal-portrait',
  type: 'image',
  url: 'avatars/gleaming-shoal-portrait.png'
}, {
  key: 'unknown-alien',
  type: 'image',
  url: 'avatars/gleaming-shoal-silhouette.png'
}, {
  key: 'vesper',
  type: 'image',
  url: 'avatars/vesper.png'
}, {
  key: 'talvine',
  type: 'image',
  url: 'avatars/talvine.png'
}, {
  key: 'valken',
  type: 'image',
  url: 'avatars/valken.png'
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
  key: 'menu-theme-terraform',
  type: 'audio',
  urls: ['music/Terraforming-Begins_Looping.mp3']
}, {
  key: 'off-limits',
  type: 'audio',
  urls: ['music/Sector-Off-Limits_Looping.mp3']
}, {
  key: 'puzzle1',
  type: 'audio',
  urls: ['music/Puzzle-Game_Looping.mp3']
}, {
  key: 'puzzle2',
  type: 'audio',
  urls: ['music/Puzzle-Game-2_Looping.mp3']
}, {
  key: 'lostjungle',
  type: 'audio',
  urls: ['music/Lost-Jungle_Looping.mp3']
}, {
  key: 'cold-moon',
  type: 'audio',
  urls: ['music/Cold-Moon.mp3']
}, {
  key: 'correct-card',
  type: 'audio',
  urls: ['soundfx/positive/glow_med_L_to_R_002.wav']
}, {
  key: 'wrong-card',
  type: 'audio',
  urls: ['soundfx/negative/SW011_Alarms_construction-kit-element_081.wav']
}, {
  key: 'save-notification',
  type: 'audio',
  urls: ['soundfx/SFX-ARCADIA_Notification01.wav']
}, {
  key: 'swish-close',
  type: 'audio',
  urls: ['soundfx/13th-whoosh-swing-sound.mp3']
}, {
  key: 'swish-open',
  type: 'audio',
  urls: ['soundfx/swoosh-metal-rod-swing-sound-made-with-bamboo-stick.mp3']
}, {
  key: 'inventory-add',
  type: 'audio',
  urls: ['soundfx/SFX-ARCADIA_Error03.wav']
}, {
  key: 'marble-impact',
  type: 'audio',
  urls: ['soundfx/Rupture - Marble_Impacts_06.wav']
}, {
  key: 'success',
  type: 'audio',
  urls: ['soundfx/positive/success-1.wav']
}, {
  key: 'tap',
  type: 'audio',
  urls: ['soundfx/glass-tap.wav']
}];

// --logic battle placeholder images

exports.logic_battle = [{
  key: 'alien-stare',
  type: 'image',
  url: 'battle/alien-stare.png'
}, {
  key: 'greek-sphinx',
  type: 'image',
  url: 'battle/greek-sphinx.png'
}, {
  key: 'cyborg-face',
  type: 'image',
  url: 'battle/cyborg-face.png'
}, {
  key: 'curly-mask',
  type: 'image',
  url: 'battle/curly-mask.png'
}, {
  key: 'lunar-module',
  type: 'image',
  url: 'battle/lunar-module.png'
}, {
  key: 'fencer',
  type: 'image',
  url: 'battle/fencer.png'
}, {
  key: 'new-born',
  type: 'image',
  url: 'battle/new-born.png'
}, {
  key: 'saint-basil-cathedral',
  type: 'image',
  url: 'battle/saint-basil-cathedral.png'
}, {
  key: 'goblin-head',
  type: 'image',
  url: 'battle/goblin-head.png'
}, {
  key: 'xenobio',
  type: 'image',
  url: 'battle/xenobio.png'
}, {
  key: 'xenopsych',
  type: 'image',
  url: 'battle/xenopsych.png'
}, {
  key: 'quasaria-logo-fill',
  type: 'image'
}, {
  key: 'battle01',
  type: 'json',
  url: 'battle/battle01.json'
}, {
  key: 'question-mark',
  type: 'image',
  url: 'ui/question-mark-button.png'
}, {
  key: 'sponsor',
  type: 'image',
  url: 'battle/sponsor.png'
}, {
  key: 'currency',
  type: 'image',
  url: 'battle/currency.png'
}, {
  key: 'emp',
  type: 'image',
  url: 'battle/emp.png'
}, {
  key: 'call-bluff',
  type: 'image',
  url: 'battle/call-bluff.png'
}];
