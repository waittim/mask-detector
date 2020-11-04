"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeakyRelu = void 0;
var LeakyRelu = /** @class */ (function () {
    function LeakyRelu() {
    }
    LeakyRelu.prototype.initialize = function (attributes) {
        this.alpha = attributes.getFloat('alpha', 0.01);
    };
    LeakyRelu.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length !== 1) {
            return false;
        }
        return this.checkInputTypes(inputs);
    };
    LeakyRelu.prototype.checkInputTypes = function (inputs) {
        if (inputs[0].type !== 'float32' && inputs[0].type !== 'float64') {
            return false;
        }
        return true;
    };
    return LeakyRelu;
}());
exports.LeakyRelu = LeakyRelu;
//# sourceMappingURL=leaky-relu.js.map