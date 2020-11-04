"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sum = void 0;
var Sum = /** @class */ (function () {
    function Sum() {
    }
    Sum.prototype.initialize = function (attributes) { };
    Sum.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length === 0) {
            return false;
        }
        var length = inputs[0].dims.length;
        for (var i = 1; i < inputs.length; i++) {
            if (length !== inputs[i].dims.length) {
                return false;
            }
            for (var j = 0; j < length; j++) {
                if (inputs[0].dims[j] !== inputs[i].dims[j]) {
                    return false;
                }
            }
        }
        return this.checkInputTypes(inputs);
    };
    Sum.prototype.checkInputTypes = function (inputs) {
        if (inputs[0].type !== 'float32' && inputs[0].type !== 'float64') {
            return false;
        }
        for (var i = 1; i < inputs.length; i++) {
            if (inputs[0].type !== inputs[i].type) {
                return false;
            }
        }
        return true;
    };
    return Sum;
}());
exports.Sum = Sum;
//# sourceMappingURL=sum.js.map