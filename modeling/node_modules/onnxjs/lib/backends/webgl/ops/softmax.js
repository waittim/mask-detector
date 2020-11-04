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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebGLSoftmax = void 0;
var softmax_1 = require("../../../ops/softmax");
var util_1 = require("../../../util");
var glsl_source_1 = require("../glsl-source");
var WebGLSoftmax = /** @class */ (function (_super) {
    __extends(WebGLSoftmax, _super);
    function WebGLSoftmax() {
        return _super.call(this) || this;
    }
    WebGLSoftmax.prototype.run = function (inferenceHandler, inputs) {
        var _this = this;
        if (!this.artifacts) {
            this.artifacts = [];
            var programInfos = this.createProgramInfos(inferenceHandler, inputs);
            programInfos.forEach(function (pi, i) {
                var artifact = inferenceHandler.session.programManager.build(pi);
                _this.artifacts.push(artifact);
            });
        }
        var runDatas = this.createRunDatas(inferenceHandler, this.artifacts.map(function (a) { return a.programInfo; }), inputs);
        runDatas.forEach(function (v, i) { return inferenceHandler.session.programManager.run(_this.artifacts[i], v); });
        // return only the last output
        return [runDatas[runDatas.length - 1].outputTextureData.tensor];
    };
    WebGLSoftmax.prototype.createSoftMaxProgramInfo = function (inferenceHandler, input, N, D, maxElementPerLogicalRow, normalizationPerLogicalRow) {
        var inputShape = input.dims.slice();
        var inputLayout = inferenceHandler.createTextureLayoutFromShape(inputShape);
        var outputShape = inputShape;
        var rank = outputShape.length;
        var textureWidth = inputLayout.width;
        var textureHeight = inputLayout.height;
        if (N < 1 || D < 1) {
            throw new Error("Logical row count N and feature count D must be greater than or equal to 1");
        }
        if (maxElementPerLogicalRow.shape.length !== 1 || normalizationPerLogicalRow.shape.length !== 1) {
            throw new Error("Dimensionality of the intermediate results should be 1");
        }
        if (maxElementPerLogicalRow.shape[0] !== N || normalizationPerLogicalRow.shape[0] !== N) {
            throw new Error("Shape of the intermediate results should be equal to logical row count");
        }
        var shaderSource = "\n    float process(int[" + rank + "] indices) {\n\n      // get offset of current logical tensor index from the 2-D texture coordinates (TexCoords)\n      int offset = coordsToOffset(TexCoords, " + textureWidth + ", " + textureHeight + ");\n\n      //determine the logical row for this index\n      int logical_row_index[1];\n      logical_row_index[0] = offset / " + D + ";\n\n      float norm_factor = _Norm(logical_row_index);\n\n      // avoid possible division by 0\n      // if norm_facor is 0, all elements are zero\n      // if so, return 0\n      if(norm_factor == 0.0)\n        return 0.0;\n\n      return exp(_A(indices) - _Max(logical_row_index)) / norm_factor;\n    }";
        return {
            inputLayouts: [inputLayout, maxElementPerLogicalRow, normalizationPerLogicalRow],
            outputLayout: inferenceHandler.createTextureLayoutFromShape(outputShape),
            samplers: ['A', 'Max', 'Norm'],
            shaderSource: shaderSource,
        };
    };
    /**
     * Create a texture that contains the normalization factor for each of the 'N' rows
     */
    WebGLSoftmax.prototype.createComputScaleProgramInfo = function (inferenceHandler, x, N, D, maxElementPerLogicalRow, outputShape) {
        var xlayout = inferenceHandler.createTextureLayoutFromShape(x.dims.slice());
        var rank = outputShape.length;
        var textureWidth = xlayout.width;
        var textureHeight = xlayout.height;
        if (N < 1 || D < 1) {
            throw new Error("Logical row count N and feature count D must be greater than or equal to 1");
        }
        if (outputShape.length !== 1) {
            throw new Error("Dimensionality of the output should be 1");
        }
        if (outputShape[0] !== N) {
            throw new Error("Shape of the output should be equal to logical row count");
        }
        if (maxElementPerLogicalRow.shape.length !== 1) {
            throw new Error("Dimensionality of the intermediate results should be 1");
        }
        if (maxElementPerLogicalRow.shape[0] !== N) {
            throw new Error("Shape of the intermediate results should be equal to logical row count");
        }
        var glsl = glsl_source_1.getGlsl(inferenceHandler.session.backend.glContext.version);
        var shaderSource = "\n    float process(int[" + rank + "] indices) {\n\n      int logical_row_start_offset = indices[0] * " + D + ";\n\n      float norm_factor = 0.0;\n      float max = _Max(indices);\n      for(int i=0; i<" + D + "; ++i)\n      {\n        norm_factor += exp(getColorAsFloat(" + glsl.texture2D + "(A, offsetToCoords(logical_row_start_offset + i, " + textureWidth + ", " + textureHeight + "))) - max);\n      }\n\n      return norm_factor;\n    }";
        return {
            inputLayouts: [xlayout, maxElementPerLogicalRow],
            outputLayout: inferenceHandler.createTextureLayoutFromShape(outputShape),
            samplers: ['A', 'Max'],
            shaderSource: shaderSource,
        };
    };
    /**
     * Create a texture that contains the maximum value of each of the 'N' rows
     */
    WebGLSoftmax.prototype.createComputeMaxProgramInfo = function (inferenceHandler, x, N, D, outputShape) {
        var xlayout = inferenceHandler.createTextureLayoutFromShape(x.dims.slice());
        var rank = outputShape.length;
        var textureWidth = xlayout.width;
        var textureHeight = xlayout.height;
        if (N < 1 || D < 1) {
            throw new Error("Logical row count N and feature count D must be greater than or equal to 1");
        }
        if (outputShape.length !== 1) {
            throw new Error("Dimensionality of the output should be 1");
        }
        if (outputShape[0] !== N) {
            throw new Error("Shape of the output should be equal to logical row count");
        }
        var glsl = glsl_source_1.getGlsl(inferenceHandler.session.backend.glContext.version);
        var shaderSource = "\n        float process(int[" + rank + "] indices) {\n\n          int logical_row_start_offset = indices[0] * " + D + ";\n\n          float max = getColorAsFloat(" + glsl.texture2D + "(A, offsetToCoords(logical_row_start_offset, " + textureWidth + ", " + textureHeight + " )));\n          for(int i=1; i<" + D + "; ++i)\n          {\n            float current = getColorAsFloat(" + glsl.texture2D + "(A, offsetToCoords(logical_row_start_offset + i, " + textureWidth + ", " + textureHeight + ")));\n            if(current > max)\n              max = current;\n          }\n\n          return max;\n        }";
        return {
            inputLayouts: [xlayout],
            outputLayout: inferenceHandler.createTextureLayoutFromShape(outputShape),
            samplers: ['A'],
            shaderSource: shaderSource,
        };
    };
    WebGLSoftmax.prototype.createProgramInfos = function (inferenceHandler, inputs) {
        var inputShape = inputs[0].dims.slice();
        var axis = util_1.ShapeUtil.normalizeAxis(this.axis, inputShape.length);
        var N = util_1.ShapeUtil.sizeToDimension(inputShape, axis);
        var D = util_1.ShapeUtil.sizeFromDimension(inputShape, axis);
        var computeMaxProgramInfo = this.createComputeMaxProgramInfo(inferenceHandler, inputs[0], N, D, [N]);
        var computeScaleProgramInfo = this.createComputScaleProgramInfo(inferenceHandler, inputs[0], N, D, computeMaxProgramInfo.outputLayout, [N]);
        var softMaxProgramInfo = this.createSoftMaxProgramInfo(inferenceHandler, inputs[0], N, D, computeMaxProgramInfo.outputLayout, computeScaleProgramInfo.outputLayout);
        var programInfos = [computeMaxProgramInfo, computeScaleProgramInfo, softMaxProgramInfo];
        return programInfos;
    };
    WebGLSoftmax.prototype.createRunDatas = function (inferenceHandler, programInfos, inputs) {
        var dataType = inputs[0].type;
        var inputTD = inferenceHandler.getOrCreateTextureData(inputs[0], programInfos[0].inputLayouts[0]);
        var runDatas = [];
        runDatas.push({
            inputTextureDatas: [inputTD],
            outputTextureData: inferenceHandler.createTextureDataFromLayout(programInfos[0].outputLayout, dataType),
            uniformData: {}
        });
        for (var i = 1; i < programInfos.length; ++i) {
            runDatas.push({
                inputTextureDatas: __spread(runDatas[i - 1].inputTextureDatas, [runDatas[i - 1].outputTextureData]),
                outputTextureData: inferenceHandler.createTextureDataFromLayout(programInfos[i].outputLayout, dataType),
                uniformData: {}
            });
        }
        return runDatas;
    };
    return WebGLSoftmax;
}(softmax_1.Softmax));
exports.WebGLSoftmax = WebGLSoftmax;
//# sourceMappingURL=softmax.js.map