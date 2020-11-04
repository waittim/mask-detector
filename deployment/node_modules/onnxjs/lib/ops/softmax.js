"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Softmax = void 0;
var Softmax = /** @class */ (function () {
    function Softmax() {
    }
    Softmax.prototype.initialize = function (attributes) {
        this.axis = attributes.getInt('axis', 1);
    };
    Softmax.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length !== 1) {
            return false;
        }
        return this.checkInputTypes(inputs);
    };
    Softmax.prototype.checkInputTypes = function (inputs) {
        if (inputs[0].type !== 'float32' && inputs[0].type !== 'float64') {
            return false;
        }
        return true;
    };
    return Softmax;
}());
exports.Softmax = Softmax;
//# sourceMappingURL=softmax.js.map