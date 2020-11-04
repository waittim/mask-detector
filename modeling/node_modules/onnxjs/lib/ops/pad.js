"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pad = void 0;
var Pad = /** @class */ (function () {
    function Pad() {
    }
    Pad.prototype.initialize = function (attributes) {
        this.mode = attributes.getString('mode', 'constant');
        this.value = attributes.getFloat('value', 0.0);
        this.pads = attributes.getInts('pads');
    };
    Pad.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length !== 1) {
            return false;
        }
        return this.checkInputTypes(inputs);
    };
    Pad.prototype.checkInputTypes = function (inputs) {
        if (inputs[0].type !== 'float32' && inputs[0].type !== 'float64') {
            return false;
        }
        return true;
    };
    return Pad;
}());
exports.Pad = Pad;
//# sourceMappingURL=pad.js.map