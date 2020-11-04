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
exports.slice = exports.CpuSliceV10 = exports.CpuSlice = void 0;
var slice_1 = require("../../../ops/slice");
var tensor_1 = require("../../../tensor");
var util_1 = require("../../../util");
var CpuSlice = /** @class */ (function (_super) {
    __extends(CpuSlice, _super);
    function CpuSlice() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuSlice.prototype.run = function (inferenceHandler, inputs) {
        var output = slice(inputs[0], this.starts, this.ends, this.axes);
        return [output];
    };
    return CpuSlice;
}(slice_1.Slice));
exports.CpuSlice = CpuSlice;
var CpuSliceV10 = /** @class */ (function (_super) {
    __extends(CpuSliceV10, _super);
    function CpuSliceV10() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuSliceV10.prototype.run = function (inferenceHandler, inputs) {
        if (inputs.length >= 5 && inputs[4].integerData.some(function (i) { return i !== 1; })) {
            throw new Error("currently non-1 steps is not supported for Slice");
        }
        var starts = Array.from(inputs[1].integerData);
        var ends = Array.from(inputs[2].integerData);
        var axes = inputs.length >= 4 ? Array.from(inputs[3].integerData) : [];
        var output = slice(inputs[0], starts, ends, axes);
        return [output];
    };
    return CpuSliceV10;
}(slice_1.SliceV10));
exports.CpuSliceV10 = CpuSliceV10;
function slice(x, starts, ends, axes) {
    if (axes.length === 0) {
        axes = x.dims.map(function (val, ind) { return ind; });
    }
    axes = util_1.ShapeUtil.normalizeAxes(axes, x.dims.length);
    starts = starts.map(function (start, ind) {
        if (start > x.dims[axes[ind]] - 1) {
            return x.dims[axes[ind]];
        }
        return util_1.ShapeUtil.normalizeAxis(start, x.dims[axes[ind]]);
    });
    ends = ends.map(function (end, ind) {
        if (end > x.dims[axes[ind]] - 1) {
            return x.dims[axes[ind]];
        }
        return util_1.ShapeUtil.normalizeAxis(end, x.dims[axes[ind]]);
    });
    var size = [];
    var adjustedStarts = [];
    axes.forEach(function (val, ind) {
        size[val] = ends[ind] - starts[ind];
        adjustedStarts[val] = starts[ind];
    });
    for (var i = 0; i < x.dims.length; i++) {
        size[i] = size[i] || x.dims[i];
        adjustedStarts[i] = adjustedStarts[i] || 0;
    }
    var newDimsStride = util_1.ShapeUtil.computeStrides(size);
    var oldDimsStride = util_1.ShapeUtil.computeStrides(x.dims ? x.dims : [x.data.length]);
    var X = x.data;
    var output = new tensor_1.Tensor(size, x.type);
    var Y = output.data;
    for (var i = 0; i < Y.length; ++i) {
        var newLogicalIndex = util_1.ShapeUtil.offsetToIndices(i, newDimsStride);
        var oldLogicalIndex = newLogicalIndex.map(function (idx, j) { return idx + adjustedStarts[j]; });
        var oldOffset = util_1.ShapeUtil.indicesToOffset(oldLogicalIndex, oldDimsStride);
        Y[i] = X[oldOffset];
    }
    return output;
}
exports.slice = slice;
//# sourceMappingURL=slice.js.map