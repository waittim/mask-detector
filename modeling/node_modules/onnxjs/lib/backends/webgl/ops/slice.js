"use strict";
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
exports.WebGLSliceV10 = exports.WebGLSlice = void 0;
var slice_1 = require("../../../ops/slice");
var util_1 = require("../../../util");
var WebGLSlice = /** @class */ (function (_super) {
    __extends(WebGLSlice, _super);
    function WebGLSlice() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLSlice.prototype.run = function (inferenceHandler, inputs) {
        return inferenceHandler.run(this, inputs);
    };
    WebGLSlice.prototype.createProgramInfo = function (handler, inputs) {
        return createProgramInfo(handler, inputs[0], this.starts, this.ends, this.axes);
    };
    WebGLSlice.prototype.createRunData = function (handler, programInfo, inputs) {
        return createRunData(handler, programInfo, inputs);
    };
    return WebGLSlice;
}(slice_1.Slice));
exports.WebGLSlice = WebGLSlice;
var WebGLSliceV10 = /** @class */ (function (_super) {
    __extends(WebGLSliceV10, _super);
    function WebGLSliceV10() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLSliceV10.prototype.run = function (inferenceHandler, inputs) {
        return inferenceHandler.run(this, inputs);
    };
    WebGLSliceV10.prototype.createProgramInfo = function (handler, inputs) {
        if (!handler.session.isInitializer(inputs[1].dataId) || !handler.session.isInitializer(inputs[2].dataId) ||
            (inputs.length >= 4 && !handler.session.isInitializer(inputs[3].dataId)) ||
            (inputs.length >= 5 && !handler.session.isInitializer(inputs[4].dataId))) {
            throw new Error("dynamic slice attributes are not allowed");
        }
        if (inputs.length >= 5 && inputs[4].integerData.some(function (i) { return i !== 1; })) {
            throw new Error("currently non-1 steps is not supported for Slice");
        }
        var starts = Array.from(inputs[1].integerData);
        var ends = Array.from(inputs[2].integerData);
        var axes = inputs.length >= 4 ? Array.from(inputs[3].integerData) : [];
        return createProgramInfo(handler, inputs[0], starts, ends, axes);
    };
    WebGLSliceV10.prototype.createRunData = function (handler, programInfo, inputs) {
        return createRunData(handler, programInfo, inputs);
    };
    return WebGLSliceV10;
}(slice_1.SliceV10));
exports.WebGLSliceV10 = WebGLSliceV10;
function createProgramInfo(handler, x, starts, ends, axes) {
    if (axes.length === 0) {
        axes = x.dims.slice(0).map(function (val, ind) { return ind; });
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
    var outputShape = x.dims.slice();
    var sliceOps = [];
    for (var i = 0; i < axes.length; i++) {
        outputShape[axes[i]] = ends[i] - starts[i];
        if (starts[i] > 0) {
            sliceOps.push("outputIdx[" + axes[i] + "] += " + starts[i] + ";");
        } // else { sliceOps.push(`outputIdx[${axes[i]}] += 0;`); }
    }
    var rank = outputShape.length;
    var shaderSource = "\n      float process(int outputIdx[" + rank + "]) {\n        " + sliceOps.join('\n      ') + "\n        return _A(outputIdx);\n      }";
    return {
        inputLayouts: [handler.getOrCreateTextureLayout(x)],
        outputLayout: handler.createTextureLayoutFromShape(outputShape),
        samplers: ['A'],
        shaderSource: shaderSource,
    };
}
function createRunData(handler, programInfo, inputs) {
    var inputTDs = [handler.getOrCreateTextureData(inputs[0], programInfo.inputLayouts[0])];
    return {
        inputTextureDatas: inputTDs,
        outputTextureData: handler.createTextureDataFromLayout(programInfo.outputLayout, inputTDs[0].tensor.type),
        uniformData: {}
    };
}
//# sourceMappingURL=slice.js.map