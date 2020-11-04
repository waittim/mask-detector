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
exports.instanceNormalization = exports.CpuInstanceNormalization = void 0;
var instance_normalization_1 = require("../../../ops/instance-normalization");
var tensor_1 = require("../../../tensor");
var CpuInstanceNormalization = /** @class */ (function (_super) {
    __extends(CpuInstanceNormalization, _super);
    function CpuInstanceNormalization() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuInstanceNormalization.prototype.run = function (inferenceHandler, inputs) {
        var output = instanceNormalization(inputs[0], inputs[1], inputs[2], this.epsilon);
        return [output];
    };
    return CpuInstanceNormalization;
}(instance_normalization_1.InstanceNormalization));
exports.CpuInstanceNormalization = CpuInstanceNormalization;
function instanceNormalization(x, scale, b, epsilon) {
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
    var temp;
    var mean;
    var variance;
    var physicalOffset;
    var iterEnd;
    var currentChannel;
    for (var nc = 0; nc < N * C; nc++) {
        physicalOffset = nc * channelSize;
        iterEnd = physicalOffset + channelSize;
        currentChannel = nc % C;
        // compute mean for this channel
        temp = 0;
        for (var i = physicalOffset; i < iterEnd; ++i) {
            temp += X[i];
        }
        mean = temp / channelSize;
        // compute variance for this channel
        temp = 0;
        for (var i = physicalOffset; i < iterEnd; ++i) {
            temp += Math.pow(X[i] - mean, 2);
        }
        variance = temp / channelSize;
        // compute normalized value for data in this channel
        for (var i = physicalOffset; i < iterEnd; ++i) {
            Y[i] = scaleData[currentChannel] * ((X[i] - mean) / Math.sqrt(variance + epsilon)) + bData[currentChannel];
        }
    }
    return output;
}
exports.instanceNormalization = instanceNormalization;
//# sourceMappingURL=instance-normalization.js.map