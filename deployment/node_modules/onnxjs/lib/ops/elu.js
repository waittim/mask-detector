"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Elu = void 0;
var Elu = /** @class */ (function () {
    function Elu() {
    }
    Elu.prototype.initialize = function (attributes) {
        this.alpha = attributes.getFloat('alpha', 1.0);
    };
    Elu.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length !== 1) {
            return false;
        }
        return this.checkInputTypes(inputs);
    };
    Elu.prototype.checkInputTypes = function (inputs) {
        if (inputs[0].type !== 'float32' && inputs[0].type !== 'float64') {
            return false;
        }
        return true;
    };
    return Elu;
}());
exports.Elu = Elu;
//# sourceMappingURL=elu.js.map