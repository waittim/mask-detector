"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reshape = void 0;
var Reshape = /** @class */ (function () {
    function Reshape() {
    }
    Reshape.prototype.initialize = function (attributes) { };
    Reshape.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length !== 2 || inputs[1].dims.length !== 1) {
            return false;
        }
        return this.checkInputTypes(inputs);
    };
    Reshape.prototype.checkInputTypes = function (inputs) {
        if (inputs[0].type !== 'float32' && inputs[0].type !== 'float64') {
            return false;
        }
        if (inputs[1].type !== 'int32') {
            return false;
        }
        return true;
    };
    return Reshape;
}());
exports.Reshape = Reshape;
//# sourceMappingURL=reshape.js.map