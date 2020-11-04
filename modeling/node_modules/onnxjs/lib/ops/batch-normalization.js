"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchNormalization = void 0;
// currently this operator supports ONLY 'test' mode
// inputs/outputs and parameters will reflect that
// the operator implementation only supports test mode
var BatchNormalization = /** @class */ (function () {
    function BatchNormalization() {
    }
    BatchNormalization.prototype.initialize = function (attributes) {
        this.epsilon = attributes.getFloat('epsilon', 1e-5);
        this.momentum = attributes.getFloat('momentum', 0.9);
        this.spatial = attributes.getInt('spatial', 1);
    };
    BatchNormalization.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length !== 5) {
            return false;
        }
        return this.checkInputTypes(inputs);
    };
    BatchNormalization.prototype.checkInputTypes = function (inputs) {
        var X = inputs[0];
        var scale = inputs[1];
        var B = inputs[2];
        var mean = inputs[3];
        var var_ = inputs[4];
        // input should atleast have three dimensions - N,C,dim1,...,dimn
        // other inputs can have only one dimensions
        if (X.dims.length < 3 || scale.dims.length !== 1 || B.dims.length !== 1 || mean.dims.length !== 1 ||
            var_.dims.length !== 1) {
            return false;
        }
        if (scale.dims[0] !== X.dims[1] || B.dims[0] !== X.dims[1] || mean.dims[0] !== X.dims[1] ||
            var_.dims[0] !== X.dims[1]) {
            return false;
        }
        if ((X.type !== 'float32' && X.type !== 'float64') || (scale.type !== 'float32' && scale.type !== 'float64') ||
            (B.type !== 'float32' && B.type !== 'float64') || (mean.type !== 'float32' && mean.type !== 'float64') ||
            (var_.type !== 'float32' && var_.type !== 'float64')) {
            return false;
        }
        return true;
    };
    return BatchNormalization;
}());
exports.BatchNormalization = BatchNormalization;
//# sourceMappingURL=batch-normalization.js.map