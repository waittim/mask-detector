"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceNormalization = void 0;
var InstanceNormalization = /** @class */ (function () {
    function InstanceNormalization() {
    }
    InstanceNormalization.prototype.initialize = function (attributes) {
        this.epsilon = attributes.getFloat('epsilon', 1e-5);
    };
    InstanceNormalization.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length !== 3) {
            return false;
        }
        return this.checkInputTypes(inputs);
    };
    InstanceNormalization.prototype.checkInputTypes = function (inputs) {
        var X = inputs[0];
        var scale = inputs[1];
        var B = inputs[2];
        // input should atleast have three dimensions - N,C,dim1,...,dimn
        // other inputs can have only one dimensions
        if (X.dims.length < 3 || scale.dims.length !== 1 || B.dims.length !== 1) {
            return false;
        }
        if (scale.dims[0] !== X.dims[1] || B.dims[0] !== X.dims[1]) {
            return false;
        }
        if ((X.type !== 'float32' && X.type !== 'float64') || (scale.type !== 'float32' && scale.type !== 'float64') ||
            (B.type !== 'float32' && B.type !== 'float64')) {
            return false;
        }
        return true;
    };
    return InstanceNormalization;
}());
exports.InstanceNormalization = InstanceNormalization;
//# sourceMappingURL=instance-normalization.js.map