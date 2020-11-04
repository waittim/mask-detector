"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReduceBase = void 0;
var operators_1 = require("../operators");
var ReduceBase = /** @class */ (function () {
    function ReduceBase() {
    }
    ReduceBase.prototype.initialize = function (attributes) {
        this.axes = attributes.getInts('axes', []);
        this.keepDims = attributes.getInt('keepdims', 1) === 1;
    };
    ReduceBase.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length !== 1) {
            return false;
        }
        return this.checkInputTypes(inputs);
    };
    ReduceBase.prototype.checkInputTypes = function (inputs) {
        if (operators_1.NUMBER_TYPES.indexOf(inputs[0].type) === -1) {
            return false;
        }
        return true;
    };
    return ReduceBase;
}());
exports.ReduceBase = ReduceBase;
//# sourceMappingURL=reduce-op.js.map