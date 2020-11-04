"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchNormalization = exports.CpuBatchNormalization = void 0;
var batch_normalization_1 = require("../../../ops/batch-normalization");
var tensor_1 = require("../../../tensor");
var CpuBatchNormalization = /** @class */ (function (_super) {
    __extends(CpuBatchNormalization, _super);
    function CpuBatchNormalization() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuBatchNormalization.prototype.run = function (inferenceHandler, inputs) {
        var output = batchNormalization(inputs[0], inputs[1], inputs[2], inputs[3], inputs[4], this.epsilon, this.momentum, this.spatial);
        return [output];
    };
    return CpuBatchNormalization;
}(batch_normalization_1.BatchNormalization));
exports.CpuBatchNormalization = CpuBatchNormalization;
function batchNormalization(x, scale, b, mean, variance, epsilon, momentum, spatial) {
    var inputDimensions = x.dims;
    var N = inputDimensions[0];
    var C = inputDimensions[1];
    // calculate channel size (i.e.) data points per channel
    var channelSize = 1;
    for (var i = 2; i < inputDimensions.length; i++) {
        channelSize *= inputDimensions[i];
    }
    var output = new tensor_1.Tensor(x.dims, x.type);
    var X = x.floatData;
    var Y = output.floatData;
    var scaleData = scale.numberData;
    var bData = b.numberData;
    var meanData = mean.numberData;
    var varianceData = variance.numberData;
    for (var nc = 0; nc < N * C; nc++) {
        var offset = nc * channelSize;
        for (var i = 0; i < channelSize; i++) {
            Y[offset + i] =
                scaleData[nc % C] * ((X[offset + i] - meanData[nc % C]) / Math.sqrt(varianceData[nc % C] + epsilon)) +
                    bData[nc % C];
        }
    }
    return output;
}
exports.batchNormalization = batchNormalization;
//# sourceMappingURL=batch-normalization.js.map