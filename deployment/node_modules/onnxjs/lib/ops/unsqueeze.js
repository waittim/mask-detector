"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Unsqueeze = void 0;
var Unsqueeze = /** @class */ (function () {
    function Unsqueeze() {
    }
    Unsqueeze.prototype.initialize = function (attributes) {
        this.axes = attributes.getInts('axes');
    };
    Unsqueeze.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length !== 1) {
            return false;
        }
        return this.checkInputTypes(inputs);
    };
    Unsqueeze.prototype.checkInputTypes = function (inputs) {
        // TODO: Support string type
        if (inputs[0].type === 'string') {
            return false;
        }
        return true;
    };
    return Unsqueeze;
}());
exports.Unsqueeze = Unsqueeze;
//# sourceMappingURL=unsqueeze.js.map