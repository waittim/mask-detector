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
exports.CpuUpsample = void 0;
var upsample_1 = require("../../../ops/upsample");
var tensor_1 = require("../../../tensor");
var CpuUpsample = /** @class */ (function (_super) {
    __extends(CpuUpsample, _super);
    function CpuUpsample() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuUpsample.prototype.run = function (inferenceHandler, inputs) {
        var _this = this;
        var xDims = inputs[0].dims;
        var yDims = xDims.map(function (dim, i) { return Math.floor(dim * _this.scales[i]); });
        var y = new tensor_1.Tensor(yDims, inputs[0].type);
        if (this.mode === 'nearest') {
            upsampleNearest(inputs[0].data, y.data, xDims, yDims, this.scales);
        }
        else {
            upsampleLinear(inputs[0].data, y.data, xDims, yDims, this.scales);
        }
        return [y];
    };
    return CpuUpsample;
}(upsample_1.Upsample));
exports.CpuUpsample = CpuUpsample;
function upsampleNearest(xData, yData, xDims, yDims, scales) {
    var dim = xDims.length;
    var inputDimCounter = new Array(dim);
    inputDimCounter.fill(0);
    var inputDimFactor = new Array(dim);
    inputDimFactor[dim - 1] = 1; // initialize dimension factor
    for (var i = dim - 2; i >= 0; i--) {
        inputDimFactor[i] = inputDimFactor[i + 1] * xDims[i + 1];
    }
    var outputDimCounter = new Array(dim);
    outputDimCounter.fill(0);
    outputDimCounter[dim - 1] = -1;
    var yIdx = 0;
    var xIdx = 0;
    for (; yIdx < yData.length; yIdx++) {
        for (var dimIdx = dim - 1; dimIdx >= 0; dimIdx--) {
            if (++outputDimCounter[dimIdx] < yDims[dimIdx]) {
                var currentInputDimCounter = 0;
                var originalIdx = getOriginalCoordinate(outputDimCounter[dimIdx], scales[dimIdx]);
                currentInputDimCounter = Math.floor(originalIdx);
                currentInputDimCounter = Math.max(0, Math.min(currentInputDimCounter, (xDims[dimIdx] - 1)));
                if (currentInputDimCounter !== inputDimCounter[dimIdx]) {
                    xIdx += (currentInputDimCounter - inputDimCounter[dimIdx]) * inputDimFactor[dimIdx];
                    inputDimCounter[dimIdx] = currentInputDimCounter;
                }
                break;
            }
            else {
                outputDimCounter[dimIdx] = 0;
                xIdx += (0 - inputDimCounter[dimIdx]) * inputDimFactor[dimIdx];
                inputDimCounter[dimIdx] = 0;
            }
        }
        yData[yIdx] = xData[xIdx];
    }
}
function upsampleLinear(xData, yData, xDims, yDims, scales) {
    var is2D = xDims.length === 2;
    var batchSize = is2D ? 1 : xDims[0];
    var numChannels = is2D ? 1 : xDims[1];
    var inputHeight = is2D ? xDims[0] : xDims[2];
    var inputWidth = is2D ? xDims[1] : xDims[3];
    var outputHeight = is2D ? yDims[0] : yDims[2];
    var outputWidth = is2D ? yDims[1] : yDims[3];
    upsampleBilinear(xData, yData, batchSize, numChannels, inputHeight, inputWidth, outputHeight, outputWidth, is2D ? scales[0] : scales[2], is2D ? scales[1] : scales[3]);
}
function upsampleBilinear(xData, yData, batchSize, numChannels, inputHeight, inputWidth, outputHeight, outputWidth, heightScale, widthScale) {
    var yOriginal = [];
    var xOriginal = [];
    var inputWidthMulY1 = new Array(outputHeight);
    var inputWidthMulY2 = new Array(outputHeight);
    var inX1 = new Array(outputWidth);
    var inX2 = new Array(outputWidth);
    var dy1 = new Array(outputHeight);
    var dy2 = new Array(outputHeight);
    var dx1 = new Array(outputWidth);
    var dx2 = new Array(outputWidth);
    for (var y = 0; y < outputHeight; ++y) {
        var inY = getOriginalCoordinate(y, heightScale);
        yOriginal.push(inY);
        inY = Math.max(0, Math.min(inY, inputHeight - 1));
        var inY1 = Math.min(Math.floor(inY), inputHeight - 1);
        var inY2 = Math.min(inY1 + 1, inputHeight - 1);
        if (inY1 === inY2) {
            dy1[y] = 0.5;
            dy2[y] = 0.5;
        }
        else {
            dy1[y] = Math.abs(inY - inY1);
            dy2[y] = Math.abs(inY - inY2);
        }
        inputWidthMulY1[y] = inputWidth * inY1;
        inputWidthMulY2[y] = inputWidth * inY2;
    }
    for (var x = 0; x < outputWidth; ++x) {
        var inX = getOriginalCoordinate(x, widthScale);
        xOriginal.push(inX);
        inX = Math.max(0, Math.min(inX, inputWidth - 1));
        inX1[x] = Math.min(Math.floor(inX), inputWidth - 1);
        inX2[x] = Math.min(inX1[x] + 1, inputWidth - 1);
        if (inX1[x] === inX2[x]) {
            dx1[x] = 0.5;
            dx2[x] = 0.5;
        }
        else {
            dx1[x] = Math.abs(inX - inX1[x]);
            dx2[x] = Math.abs(inX - inX2[x]);
        }
    }
    var xOffset = 0;
    var yOffset = 0;
    for (var n = 0; n < batchSize; ++n) {
        for (var c = 0; c < numChannels; ++c) {
            for (var y = 0; y < outputHeight; ++y) {
                for (var x = 0; x < outputWidth; ++x) {
                    var x11 = xData[xOffset + inputWidthMulY1[y] + inX1[x]];
                    var x21 = xData[xOffset + inputWidthMulY1[y] + inX2[x]];
                    var x12 = xData[xOffset + inputWidthMulY2[y] + inX1[x]];
                    var x22 = xData[xOffset + inputWidthMulY2[y] + inX2[x]];
                    yData[yOffset + outputWidth * y + x] =
                        (dx2[x] * dy2[y] * x11 + dx1[x] * dy2[y] * x21 + dx2[x] * dy1[y] * x12 + dx1[x] * dy1[y] * x22);
                }
            }
            xOffset += inputHeight * inputWidth;
            yOffset += outputWidth * outputHeight;
        }
    }
}
function getOriginalCoordinate(xResized, xScale) {
    // Coordinate transformation mode attr was introduced in version 11, before that asymmetric mode was the only
    // available transformation mode
    // return ((xResized + 0.5) / xScale) - 0.5;
    return xResized / xScale;
}
//# sourceMappingURL=upsample.js.map