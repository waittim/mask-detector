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
exports.reduceProd = exports.reduceMean = exports.reduceMin = exports.reduceMax = exports.reduceLogSum = exports.reduceSumSquare = exports.reduceSum = exports.CpuReduceProd = exports.CpuReduceMean = exports.CpuReduceMin = exports.CpuReduceMax = exports.CpuReduceLogSum = exports.CpuReduceSumSquare = exports.CpuReduceSum = void 0;
var reduce_op_1 = require("../../../ops/reduce-op");
var util_1 = require("../../../util");
var CpuReduceSum = /** @class */ (function (_super) {
    __extends(CpuReduceSum, _super);
    function CpuReduceSum() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuReduceSum.prototype.run = function (inferenceHandler, inputs) {
        var output = reduceSum(inputs[0], util_1.ShapeUtil.normalizeAxes(this.axes, inputs[0].dims.length), this.keepDims);
        return [output];
    };
    return CpuReduceSum;
}(reduce_op_1.ReduceBase));
exports.CpuReduceSum = CpuReduceSum;
var CpuReduceSumSquare = /** @class */ (function (_super) {
    __extends(CpuReduceSumSquare, _super);
    function CpuReduceSumSquare() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuReduceSumSquare.prototype.run = function (inferenceHandler, inputs) {
        var output = reduceSumSquare(inputs[0], util_1.ShapeUtil.normalizeAxes(this.axes, inputs[0].dims.length), this.keepDims);
        return [output];
    };
    return CpuReduceSumSquare;
}(reduce_op_1.ReduceBase));
exports.CpuReduceSumSquare = CpuReduceSumSquare;
var CpuReduceLogSum = /** @class */ (function (_super) {
    __extends(CpuReduceLogSum, _super);
    function CpuReduceLogSum() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuReduceLogSum.prototype.run = function (inferenceHandler, inputs) {
        var output = reduceLogSum(inputs[0], util_1.ShapeUtil.normalizeAxes(this.axes, inputs[0].dims.length), this.keepDims);
        return [output];
    };
    return CpuReduceLogSum;
}(reduce_op_1.ReduceBase));
exports.CpuReduceLogSum = CpuReduceLogSum;
var CpuReduceMax = /** @class */ (function (_super) {
    __extends(CpuReduceMax, _super);
    function CpuReduceMax() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuReduceMax.prototype.run = function (inferenceHandler, inputs) {
        var output = reduceMax(inputs[0], util_1.ShapeUtil.normalizeAxes(this.axes, inputs[0].dims.length), this.keepDims);
        return [output];
    };
    return CpuReduceMax;
}(reduce_op_1.ReduceBase));
exports.CpuReduceMax = CpuReduceMax;
var CpuReduceMin = /** @class */ (function (_super) {
    __extends(CpuReduceMin, _super);
    function CpuReduceMin() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuReduceMin.prototype.run = function (inferenceHandler, inputs) {
        var output = reduceMin(inputs[0], util_1.ShapeUtil.normalizeAxes(this.axes, inputs[0].dims.length), this.keepDims);
        return [output];
    };
    return CpuReduceMin;
}(reduce_op_1.ReduceBase));
exports.CpuReduceMin = CpuReduceMin;
var CpuReduceMean = /** @class */ (function (_super) {
    __extends(CpuReduceMean, _super);
    function CpuReduceMean() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuReduceMean.prototype.run = function (inferenceHandler, inputs) {
        var output = reduceMean(inputs[0], util_1.ShapeUtil.normalizeAxes(this.axes, inputs[0].dims.length), this.keepDims);
        return [output];
    };
    return CpuReduceMean;
}(reduce_op_1.ReduceBase));
exports.CpuReduceMean = CpuReduceMean;
var CpuReduceProd = /** @class */ (function (_super) {
    __extends(CpuReduceProd, _super);
    function CpuReduceProd() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuReduceProd.prototype.run = function (inferenceHandler, inputs) {
        var output = reduceProd(inputs[0], util_1.ShapeUtil.normalizeAxes(this.axes, inputs[0].dims.length), this.keepDims);
        return [output];
    };
    return CpuReduceProd;
}(reduce_op_1.ReduceBase));
exports.CpuReduceProd = CpuReduceProd;
// Functions implementing specific reduce operations
function reduceSum(input, axes, keepDims) {
    return util_1.ReduceUtil.calcReduce(input, axes, keepDims, function (b) { return b; }, function (a, b) { return a + b; });
}
exports.reduceSum = reduceSum;
function reduceSumSquare(input, axes, keepDims) {
    return util_1.ReduceUtil.calcReduce(input, axes, keepDims, function (b) { return b * b; }, function (a, b) { return a + b; });
}
exports.reduceSumSquare = reduceSumSquare;
function reduceLogSum(input, axes, keepDims) {
    var output = util_1.ReduceUtil.calcReduce(input, axes, keepDims, function (b) { return b; }, function (a, b) { return a + b; });
    var length = output.floatData.length;
    for (var i = 0; i < length; i++) {
        output.floatData[i] = Math.log(output.floatData[i]);
    }
    return output;
}
exports.reduceLogSum = reduceLogSum;
function reduceMax(input, axes, keepDims) {
    return util_1.ReduceUtil.calcReduce(input, axes, keepDims, function (b) { return b; }, function (a, b) { return Math.max(a, b); });
}
exports.reduceMax = reduceMax;
function reduceMin(input, axes, keepDims) {
    return util_1.ReduceUtil.calcReduce(input, axes, keepDims, function (b) { return b; }, function (a, b) { return Math.min(a, b); });
}
exports.reduceMin = reduceMin;
function reduceMean(input, axes, keepDims) {
    var output = util_1.ReduceUtil.calcReduce(input, axes, keepDims, function (b) { return b; }, function (a, b) { return a + b; });
    var outputDims = util_1.ReduceUtil.calcReduceShape(input.dims, axes, keepDims);
    var inputSize = util_1.ShapeUtil.size(input.dims);
    var outputSize = util_1.ShapeUtil.size(outputDims);
    var numItems = inputSize / outputSize;
    var length = output.floatData.length;
    for (var i = 0; i < length; i++) {
        output.floatData[i] = output.floatData[i] / numItems;
    }
    return output;
}
exports.reduceMean = reduceMean;
function reduceProd(input, axes, keepDims) {
    return util_1.ReduceUtil.calcReduce(input, axes, keepDims, function (b) { return b; }, function (a, b) { return a * b; });
}
exports.reduceProd = reduceProd;
//# sourceMappingURL=reduce.js.map