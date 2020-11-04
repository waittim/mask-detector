"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transpose = void 0;
var Transpose = /** @class */ (function () {
    function Transpose() {
    }
    Transpose.prototype.initialize = function (attributes) {
        this.perm = attributes.getInts('perm', []);
    };
    Transpose.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length !== 1) {
            return false;
        }
        return this.checkInputTypes(inputs);
    };
    Transpose.prototype.checkInputTypes = function (inputs) {
        if (inputs[0].type !== 'float32' && inputs[0].type !== 'float64') {
            return false;
        }
        return true;
    };
    return Transpose;
}());
exports.Transpose = Transpose;
//# sourceMappingURL=transpose.js.map