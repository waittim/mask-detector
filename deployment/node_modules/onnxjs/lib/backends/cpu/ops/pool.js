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
exports.pool = exports.globalMaxPool = exports.maxPool = exports.globalAveragePool = exports.averagePool = exports.CpuGlobalMaxPool = exports.CpuMaxPool = exports.CpuGlobalAveragePool = exports.CpuAveragePool = void 0;
var pool_1 = require("../../../ops/pool");
var tensor_1 = require("../../../tensor");
var util_1 = require("../../../util");
var CpuAveragePool = /** @class */ (function (_super) {
    __extends(CpuAveragePool, _super);
    function CpuAveragePool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuAveragePool.prototype.run = function (inferenceHandler, inputs) {
        var output = averagePool(inputs[0], this.autoPad, this.countIncludePad, this.kernelShape, this.pads, this.strides);
        return [output];
    };
    return CpuAveragePool;
}(pool_1.AveragePool));
exports.CpuAveragePool = CpuAveragePool;
var CpuGlobalAveragePool = /** @class */ (function (_super) {
    __extends(CpuGlobalAveragePool, _super);
    function CpuGlobalAveragePool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuGlobalAveragePool.prototype.run = function (inferenceHandler, inputs) {
        var output = globalAveragePool(inputs[0]);
        return [output];
    };
    return CpuGlobalAveragePool;
}(pool_1.GlobalAveragePool));
exports.CpuGlobalAveragePool = CpuGlobalAveragePool;
var CpuMaxPool = /** @class */ (function (_super) {
    __extends(CpuMaxPool, _super);
    function CpuMaxPool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuMaxPool.prototype.run = function (inferenceHandler, inputs) {
        var output = maxPool(inputs[0], this.autoPad, this.kernelShape, this.pads, this.strides);
        return [output];
    };
    return CpuMaxPool;
}(pool_1.MaxPool));
exports.CpuMaxPool = CpuMaxPool;
var CpuGlobalMaxPool = /** @class */ (function (_super) {
    __extends(CpuGlobalMaxPool, _super);
    function CpuGlobalMaxPool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuGlobalMaxPool.prototype.run = function (inferenceHandler, inputs) {
        var output = globalMaxPool(inputs[0]);
        return [output];
    };
    return CpuGlobalMaxPool;
}(pool_1.GlobalMaxPool));
exports.CpuGlobalMaxPool = CpuGlobalMaxPool;
// Functions implementing specific pooling operations
function averagePool(input, autoPad, countIncludePad, kernelShape, pads, strides) {
    return pool(false, input, autoPad, countIncludePad, kernelShape, pads, strides, 0, function (a, b) { return (a + b); }, function (a, b) { return (a / b); });
}
exports.averagePool = averagePool;
function globalAveragePool(input) {
    return pool(true, input, 'NOTSET', false, [], [], [], 0, function (a, b) { return (a + b); }, function (a, b) { return (a / b); });
}
exports.globalAveragePool = globalAveragePool;
function maxPool(input, autoPad, kernelShape, pads, strides) {
    return pool(false, input, autoPad, false, kernelShape, pads, strides, Number.MIN_SAFE_INTEGER, function (a, b) { return (Math.max(a, b)); }, function (a, b) { return a; });
}
exports.maxPool = maxPool;
function globalMaxPool(input) {
    return pool(true, input, 'NOTSET', false, [], [], [], Number.MIN_SAFE_INTEGER, function (a, b) { return (Math.max(a, b)); }, function (a, b) { return a; });
}
exports.globalMaxPool = globalMaxPool;
/**
 * Perform pooling operations based on input
 * @param isGlobalOperator If true, perform global pooling.
 * @param input The input tensor.
 * @param autoPad DEPRECATED attribute supported for legacy models. Specifies how to implicitly calculate pads in each
 *     dimension. Can take values NOTSET, SAME_UPPER, SAME_LOWER, or VALID
 * @param countIncludePad Whether include pad pixels when calculating values for the edges.
 * @param kernelShape The size of the kernel along each axis.
 * @param pads Padding for the beginning and ending along each axis. `pads` format should be as follow [x1_begin,
 *       x2_begin...x1_end, x2_end,...], where xi_begin the number of pixels added at the beginning of axis `i` and
 *       xi_end, the number of pixels added at the end of axis `i`.
 * @param strides Stride along each axis.
 * @param startVal The initial value to do pooling operations
 * @param processOp The operation to be performed on each element inside kernel
 * @param finalOp The operation to be performed over all elements inside kernel
 */
function pool(isGlobalOperator, input, autoPad, countIncludePad, kernelShape, pads, strides, startVal, processOp, finalOp) {
    // adjust the shapes of input attributes
    util_1.PoolConvUtil.adjustPoolAttributes(isGlobalOperator, input.dims, kernelShape, strides, pads);
    // calculate output shape based on input attributes.
    var outputShape = util_1.PoolConvUtil.computePoolOutputShape(isGlobalOperator, input.dims, strides, kernelShape, pads, autoPad);
    var kernelSize = util_1.ShapeUtil.size(kernelShape);
    var kernelStrides = util_1.ShapeUtil.computeStrides(kernelShape);
    var stridesRank = kernelStrides.length;
    var rank = outputShape.length;
    var outputSize = util_1.ShapeUtil.size(outputShape);
    var output = new tensor_1.Tensor(outputShape, input.type);
    var outputStride = util_1.ShapeUtil.computeStrides(outputShape);
    for (var ind = 0; ind < outputSize; ind++) {
        var curInd = util_1.ShapeUtil.offsetToIndices(ind, outputStride);
        var startInd = curInd.slice(0);
        var x = curInd.slice(0);
        // calculate the start indices of kernel corresponding to current output indices
        for (var i = 0; i < stridesRank; i++) {
            startInd[rank - stridesRank + i] = curInd[rank - stridesRank + i] * strides[i];
        }
        var value = startVal;
        var pad = 0;
        var isPad = false;
        // loop through elements within kernel
        for (var i = 0; i < kernelSize; i++) {
            var offset = util_1.ShapeUtil.offsetToIndices(i, kernelStrides);
            isPad = false;
            // "Shift" the kernel by the kernel start indices to loop through the kernel mapped to current output indices
            for (var j = rank - stridesRank; j < rank; j++) {
                x[j] = startInd[j] + offset[j - rank + stridesRank] - pads[j - 2];
                // check if current indices fall in the padding area
                if (x[j] >= input.dims[j] || x[j] < 0) {
                    pad++;
                    isPad = true;
                    break;
                }
            }
            value = isPad ? value : processOp(value, input.get(x));
        }
        value = countIncludePad ? finalOp(value, kernelSize) : finalOp(value, kernelSize - pad);
        output.set(curInd, value);
    }
    return output;
}
exports.pool = pool;
//# sourceMappingURL=pool.js.map