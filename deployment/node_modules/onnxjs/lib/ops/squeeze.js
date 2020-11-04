"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Squeeze = void 0;
var Squeeze = /** @class */ (function () {
    function Squeeze() {
    }
    Squeeze.prototype.initialize = function (attributes) {
        this.axes = attributes.getInts('axes');
    };
    Squeeze.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length !== 1) {
            return false;
        }
        return this.checkInputTypes(inputs);
    };
    Squeeze.prototype.checkInputTypes = function (inputs) {
        // TODO: Support string type
        if (inputs[0].type === 'string') {
            return false;
        }
        return true;
    };
    return Squeeze;
}());
exports.Squeeze = Squeeze;
//# sourceMappingURL=squeeze.js.map