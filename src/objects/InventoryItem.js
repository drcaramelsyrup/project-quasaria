/*
 * InventoryItem
 * =============
 *
 * Object representing pieces of information or tactics in player's inventory
 */

'use strict';

module.exports = InventoryItem;

function InventoryItem(game, id, name, description) {
  this._id = id;
  this._name = name;
  this._description = description;
}

/** Explicitly define setters and getters */
// id
Object.defineProperty(InventoryItem.prototype, 'id', {
  get: function () {
    return this._id;
  },
  set: function (value) {
    this._id = value;
  }
});

// name
Object.defineProperty(InventoryItem.prototype, 'name', {
  get: function () {
    return this._name;
  },
  set: function (value) {
    this._name = value;
  }
});

// description
Object.defineProperty(InventoryItem.prototype, 'description', {
  get: function () {
    return this._description;
  },
  set: function (value) {
    this._description = value;
  }
});

InventoryItem.prototype.update = function () {
  // TODO: Stub.
};
