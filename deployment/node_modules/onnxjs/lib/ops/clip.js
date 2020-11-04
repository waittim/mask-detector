"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Clip = void 0;
var Clip = /** @class */ (function () {
    function Clip() {
    }
    Clip.prototype.initialize = function (attributes) {
        this.min = attributes.getFloat('min', -3.4028234663852886e+38);
        this.max = attributes.getFloat('max', 3.4028234663852886e+38);
    };
    Clip.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length !== 1) {
            return false;
        }
        return this.checkInputTypes(inputs);
    };
    Clip.prototype.checkInputTypes = function (inputs) {
        if (inputs[0].type !== 'float32' && inputs[0].type !== 'float64') {
            return false;
        }
        return true;
    };
    return Clip;
}());
exports.Clip = Clip;
//# sourceMappingURL=clip.js.map