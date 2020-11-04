"use strict";
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
exports.argMax = exports.CpuArgMax = void 0;
var argMax_1 = require("../../../ops/argMax");
var tensor_1 = require("../../../tensor");
var util_1 = require("../../../util");
var CpuArgMax = /** @class */ (function (_super) {
    __extends(CpuArgMax, _super);
    function CpuArgMax() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuArgMax.prototype.run = function (inferenceHandler, inputs) {
        var output = argMax(inputs[0], this.axis, this.keepDims);
        return [output];
    };
    return CpuArgMax;
}(argMax_1.ArgMax));
exports.CpuArgMax = CpuArgMax;
function argMax(x, axis, keepdims) {
    var rank = x.dims ? x.dims.length : 1;
    axis = util_1.ShapeUtil.normalizeAxis(axis, rank);
    var outputDims = util_1.ReduceUtil.calcReduceShape(x.dims, [axis], true);
    var X = x.data;
    var Y = new Int32Array(util_1.ShapeUtil.size(outputDims));
    var blockSize = util_1.ShapeUtil.sizeFromDimension(x.dims, axis + 1);
    var strides = util_1.ShapeUtil.computeStrides(outputDims);
    var inputStrides = util_1.ShapeUtil.computeStrides(x.dims);
    var indicesY = new Array(x.dims.length);
    for (var i = 0; i < Y.length; i++) {
        var indices = util_1.ShapeUtil.offsetToIndices(i, strides);
        // map index
        util_1.BroadcastUtil.fillIndex(indices, x.dims, indicesY);
        var offset = util_1.ShapeUtil.indicesToOffset(indicesY, inputStrides);
        var max = x.data[offset];
        var index = 0;
        for (var j = 0; j < x.dims[axis]; ++j) {
            var value = X[offset + j * blockSize];
            if (value > max) {
                max = value;
                index = j;
            }
        }
        Y[i] = index;
    }
    return new tensor_1.Tensor(keepdims ? outputDims : util_1.ReduceUtil.calcReduceShape(x.dims, [axis], keepdims), 'int32', undefined, undefined, Y);
}
exports.argMax = argMax;
//# sourceMappingURL=argMax.js.map