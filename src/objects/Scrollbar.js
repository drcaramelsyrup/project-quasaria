/*
 * Scrollbar
 * =========
 *
 * Bitmap scrollbar that follows a set of given points.
 */

'use strict';

module.exports = Scrollbar;

function Scrollbar(game, x, y, uiParent, points, maxScroll, lineWidth = 2, scrollbarWidth = 6) {
  Phaser.Group.call(this, game/*, ...args*/);

  this._game = game;
  // Dispatch signals; others may attach events to these signals
  this.onDragStart = new Phaser.Signal();
  this.onDrag = new Phaser.Signal();
  this.onDragStop = new Phaser.Signal();
  this.onSetValue = new Phaser.Signal();

  // Initial value
  this._value = 0;
  // How wide is our scrollbar?
  this._scrollbarWidth = scrollbarWidth;
  // How many pixels down can we scroll?
  this._maxScroll = maxScroll;
  // Determines path of scrollbar, as well as bounds
  this.points = points;

  // Draw bitmap path
  this.maxWidth = Math.max(...this.points.x);
  this.maxHeight = Math.max(...this.points.y);

  var bmdPath = this._game.make.bitmapData(this.maxWidth + lineWidth, this.maxHeight + lineWidth);
  var interpInc = 1 / this.maxHeight;
  for (var i = 0; i < 1; i += interpInc) {
    var px = this._game.math.linearInterpolation(this.points.x, i);
    var py = this._game.math.linearInterpolation(this.points.y, i);
    bmdPath.rect(px, py, lineWidth, lineWidth, '#48f2ff');
  }

  this.scrollbarLine = new SlickUI.Element.DisplayObject(
    x, y, this._game.make.sprite(0,0, bmdPath));

  // Draw scrollbar
  // this._scrollbarWidth = lineWidth*2;
  this._scrollbarRatio = (this.maxHeight + this._scrollbarWidth - this._maxScroll) / this.maxHeight;

  // Bitmap data for scrollbar
  this._bmdScroll = this._game.make.bitmapData(
    this.maxWidth + this._scrollbarWidth, 
    this.maxHeight + this._scrollbarWidth);

  for (i = 0; i < this._scrollbarRatio; i += interpInc) {
    px = this._game.math.linearInterpolation(points.x, i);
    py = this._game.math.linearInterpolation(points.y, i);
    this._bmdScroll.rect(px, py, this._scrollbarWidth, this._scrollbarWidth, '#48f2ff');
  }
  var scrollbarSprite = this._game.make.sprite(0,0, this._bmdScroll);
  this.scrollbar = new SlickUI.Element.DisplayObject(
    x-this._scrollbarWidth/2, 
    y-this._scrollbarWidth/2, 
    scrollbarSprite);

  // Display events
  scrollbarSprite.inputEnabled = true;
  scrollbarSprite.input.useHandCursor = true;
  
  // Handle mouse input
  scrollbarSprite.events.onInputDown.add(function (sprite, pointer) {
    this._dragging = true;
    this._dragPoint = pointer.y;
    this._dragValue = this._value;

    this.onDragStart.dispatch(this._value);
  }, this);
  scrollbarSprite.events.onInputUp.add(function () {
    this._dragging = false;

    this.onDragStop.dispatch(this._value);
  }, this);

  this._game.input.addMoveCallback(function (pointer, pointerX, pointerY) {
    if (!this._dragging)
      return;

    // Measure scroll relative to dragPoint
    var start = this._dragPoint - this._dragValue*this._maxScroll;
    var clampedDelta = Math.min(Math.max(0, pointerY - start), this._maxScroll);

    // Update value
    this._value = (1/this._maxScroll)*clampedDelta;

    // Redraw bitmap to update sprite
    this.redraw();

    this.onDrag.dispatch(this._value);
    
  }, this);

  // Add to SlickUI parent
  uiParent.add(this.scrollbarLine);
  uiParent.add(this.scrollbar);
  
}
Scrollbar.prototype = Object.create(Phaser.Group.prototype);
Scrollbar.prototype.constructor = Scrollbar;

Scrollbar.prototype.redraw = function () {
  this._bmdScroll.clear();
  // Redraw bitmap to update sprite
  var startBitmap = this._value*this._maxScroll / this.maxHeight;
  var interpInc = 1/this.maxHeight;
  for (var i = startBitmap; i < startBitmap + this._scrollbarRatio; i += interpInc) {
    var px = this._game.math.linearInterpolation(this.points.x, i);
    var py = this._game.math.linearInterpolation(this.points.y, i);
    this._bmdScroll.rect(px, py, this._scrollbarWidth, this._scrollbarWidth, '#48f2ff');
  }
};

Scrollbar.prototype.destroy = function () {
  // if display container exists (i.e. not destroyed)
  if (typeof this.scrollbarLine.container !== 'undefined' && this.scrollbarLine.container !== null) {
    this.scrollbarLine.container.displayGroup.removeAll(true);
    this.scrollbarLine.container.displayGroup.destroy();
    this.scrollbarLine.container = undefined;
  }
  
  if (typeof this.scrollbar.container !== 'undefined' && this.scrollbar.container !== null) {
    this.scrollbar.container.displayGroup.removeAll(true);
    this.scrollbar.container.displayGroup.destroy();
    this.scrollbar.container = undefined;
  }
  this.scrollbarLine.sprite = undefined;
  this.scrollbar.sprite = undefined;
};

Scrollbar.prototype.update = function () {
  // TODO: Stub.
};

/** Explicitly define setters and getters */
// value
Object.defineProperty(Scrollbar.prototype, 'value', {
  get: function () {
    return this._value;
  },
  set: function (value) {
    this._value = Math.min(Math.max(0, value), 1);
    this.redraw();
    this.onSetValue.dispatch(this._value);
  }
});
