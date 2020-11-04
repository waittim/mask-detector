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
exports.gather = exports.CpuGather = void 0;
var gather_1 = require("../../../ops/gather");
var tensor_1 = require("../../../tensor");
var util_1 = require("../../../util");
var CpuGather = /** @class */ (function (_super) {
    __extends(CpuGather, _super);
    function CpuGather() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuGather.prototype.run = function (inferenceHandler, inputs) {
        var output = gather(inputs[0], inputs[1], this.axis);
        return [output];
    };
    return CpuGather;
}(gather_1.Gather));
exports.CpuGather = CpuGather;
function gather(x, indices, axis) {
    axis = util_1.ShapeUtil.normalizeAxis(axis, x.dims.length);
    var dims = x.dims.slice();
    var newDims = dims.slice();
    var indicesData = indices.data;
    newDims[axis] = indicesData.length;
    var dimsStrides = util_1.ShapeUtil.computeStrides(dims);
    var newDimsStrides = util_1.ShapeUtil.computeStrides(newDims);
    var output = new tensor_1.Tensor(newDims, x.type);
    var Y = output.numberData;
    var X = x.data;
    for (var i = 0; i < Y.length; ++i) {
        var newLogicalIndex = util_1.ShapeUtil.offsetToIndices(i, newDimsStrides);
        var oldLogicalIndex = newLogicalIndex.slice();
        var idx = indicesData[newLogicalIndex[axis]];
        oldLogicalIndex[axis] = idx < 0 ? idx + dims[axis] : idx;
        var oldOffset = util_1.ShapeUtil.indicesToOffset(oldLogicalIndex, dimsStrides);
        Y[i] = X[oldOffset];
    }
    // calculate the output dims
    var outputDims = dims.slice(0, axis).concat(indices.dims).concat(dims.slice(axis + 1));
    return new tensor_1.Tensor(outputDims, x.type, undefined, undefined, Y);
}
exports.gather = gather;
//# sourceMappingURL=gather.js.map