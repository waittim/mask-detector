"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Split = void 0;
var Split = /** @class */ (function () {
    function Split(numOutputs) {
        this.numOutputs = numOutputs;
    }
    Split.prototype.initialize = function (attributes) {
        this.axis = attributes.getInt('axis', 0);
        this.split = attributes.getInts('split', []);
    };
    Split.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length !== 1) {
            return false;
        }
        return this.checkInputTypes(inputs);
    };
    Split.prototype.checkInputTypes = function (inputs) {
        if (inputs[0].type !== 'int8' && inputs[0].type !== 'uint8' && inputs[0].type !== 'int16' &&
            inputs[0].type !== 'uint16' && inputs[0].type !== 'int32' && inputs[0].type !== 'uint32' &&
            inputs[0].type !== 'float32' && inputs[0].type !== 'float64' && inputs[0].type !== 'bool') {
            return false;
        }
        return true;
    };
    return Split;
}());
exports.Split = Split;
//# sourceMappingURL=split.js.map