"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatMul = void 0;
var MatMul = /** @class */ (function () {
    function MatMul() {
    }
    MatMul.prototype.initialize = function (attributes) { };
    MatMul.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length !== 2) {
            return false;
        }
        if (inputs[0].dims[inputs[0].dims.length - 1] !== inputs[1].dims[inputs[1].dims.length - 2]) {
            return false;
        }
        return this.checkInputTypes(inputs);
    };
    MatMul.prototype.checkInputTypes = function (inputs) {
        if (inputs[0].type !== 'float32' && inputs[0].type !== 'float64') {
            return false;
        }
        if (inputs[1].type !== 'float32' && inputs[1].type !== 'float64') {
            return false;
        }
        if (inputs[0].type !== inputs[1].type) {
            return false;
        }
        return true;
    };
    return MatMul;
}());
exports.MatMul = MatMul;
//# sourceMappingURL=matmul.js.map