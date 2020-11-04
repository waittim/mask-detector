"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgMax = void 0;
var operators_1 = require("../operators");
var ArgMax = /** @class */ (function () {
    function ArgMax() {
    }
    ArgMax.prototype.initialize = function (attributes) {
        this.axis = attributes.getInt('axis', 0);
        this.keepDims = attributes.getInt('keepdims', 1) === 1;
    };
    ArgMax.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length !== 1) {
            return false;
        }
        return this.checkInputTypes(inputs);
    };
    ArgMax.prototype.checkInputTypes = function (inputs) {
        if (operators_1.NUMBER_TYPES.indexOf(inputs[0].type) === -1) {
            return false;
        }
        return true;
    };
    return ArgMax;
}());
exports.ArgMax = ArgMax;
//# sourceMappingURL=argMax.js.map