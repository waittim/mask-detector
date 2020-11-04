"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tile = void 0;
var operators_1 = require("../operators");
var Tile = /** @class */ (function () {
    function Tile() {
    }
    Tile.prototype.initialize = function (attributes) { };
    Tile.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length !== 2) {
            return false;
        }
        if (inputs[1].dims.length !== 1) {
            return false;
        }
        if (inputs[1].dims[0] !== inputs[0].dims.length) {
            return false;
        }
        return this.checkInputTypes(inputs);
    };
    Tile.prototype.checkInputTypes = function (inputs) {
        if (operators_1.NUMBER_TYPES.indexOf(inputs[0].type) === -1) {
            return false;
        }
        if (inputs[1].type !== 'int32' && inputs[1].type !== 'int16') {
            return false;
        }
        return true;
    };
    return Tile;
}());
exports.Tile = Tile;
//# sourceMappingURL=tile.js.map