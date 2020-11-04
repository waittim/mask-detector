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
exports.WebGLInstanceNormalization = void 0;
var instance_normalization_1 = require("../../../ops/instance-normalization");
var glsl_source_1 = require("../glsl-source");
var WebGLInstanceNormalization = /** @class */ (function (_super) {
    __extends(WebGLInstanceNormalization, _super);
    function WebGLInstanceNormalization() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLInstanceNormalization.prototype.run = function (inferenceHandler, inputs) {
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
        return [runDatas[1].outputTextureData.tensor];
    };
    WebGLInstanceNormalization.prototype.checkInputTypes = function (inputs) {
        if (!_super.prototype.checkInputTypes.call(this, inputs)) {
            return false;
        }
        if (inputs[0].dims.length !== 4) {
            // currently webgl implementation only support 4-D input.
            return false;
        }
        return true;
    };
    WebGLInstanceNormalization.prototype.createMeanAndVarianceProgramInfo = function (inferenceHandler, xLayout) {
        var xDims = xLayout.shape;
        var channel = xDims[1];
        var channelSize = xDims[2] * xDims[3];
        var outputShape = [xDims[0], channel];
        var outputUnpackedShape = [xDims[0], channel * 4];
        var shaderSource = "\n    vec4 process(int[2] indices) {\n      vec4 v = vec4(0.0);\n      int a[4];\n      a[0] = indices[0];\n      a[1] = indices[1];\n      float temp = 0.0;\n      for(int a2=0; a2<" + xDims[2] + "; a2++) {\n        a[2] = a2;\n        for(int a3=0; a3<" + xDims[3] + "; a3++) {\n          a[3] = a3;\n          float x = _X(a);\n          temp += x;\n        }\n      }\n      float mean = temp / float(" + channelSize + ");\n      temp = 0.0;\n      for(int a2=0; a2<" + xDims[2] + "; a2++) {\n        a[2] = a2;\n        for(int a3=0; a3<" + xDims[3] + "; a3++) {\n          a[3] = a3;\n          float x = _X(a);\n          temp += (x - mean) * (x - mean);\n        }\n      }\n      v.r = mean;\n      v.g = temp / float(" + channelSize + ");\n\n      return v;\n    }";
        return {
            inputLayouts: [xLayout],
            outputLayout: inferenceHandler.createTextureLayoutFromShape(outputShape, 4, outputUnpackedShape),
            samplers: ['X'],
            shaderSource: shaderSource,
        };
    };
    WebGLInstanceNormalization.prototype.createComputOutputProgramInfo = function (inferenceHandler, xLayout, scaleLayout, bLayout, meanAndVarianceLayout) {
        var glsl = glsl_source_1.getGlsl(inferenceHandler.session.backend.glContext.version);
        var shaderSource = "\n    vec4 getMeanAndVariance(int[2] mv) {\n      int offset = indicesToOffset_MeanAndVariance(mv);\n      vec2 coords = offsetToCoords(offset, " + meanAndVarianceLayout.width + ", " + meanAndVarianceLayout.height + ");\n      return " + glsl.texture2D + "(MeanAndVariance, coords);\n    }\n\n    float process(int[4] indices) {\n\n          int mv[2];\n          mv[0] = indices[0];\n          mv[1] = indices[1];\n          vec4 mean_and_variance = getMeanAndVariance(mv);\n          float mean = mean_and_variance.r;\n          float variance = mean_and_variance.g;\n\n          int sb[1];\n          sb[0] = indices[1];\n          float scale = _Scale(sb);\n          float b = _B(sb);\n\n          return scale * (_X(indices) - mean) / sqrt(variance + epsilon) + b;\n        }";
        return {
            inputLayouts: [xLayout, meanAndVarianceLayout, scaleLayout, bLayout],
            outputLayout: inferenceHandler.createTextureLayoutFromShape(xLayout.shape),
            samplers: ['X', 'MeanAndVariance', 'Scale', 'B'],
            variables: [{ name: 'epsilon', type: 'float' }],
            shaderSource: shaderSource,
        };
    };
    WebGLInstanceNormalization.prototype.createProgramInfos = function (inferenceHandler, inputs) {
        var xLayout = inferenceHandler.getOrCreateTextureLayout(inputs[0]);
        var scaleLayout = inferenceHandler.getOrCreateTextureLayout(inputs[1]);
        var bLayout = inferenceHandler.getOrCreateTextureLayout(inputs[2]);
        var meanAndVarianceProgramInfo = this.createMeanAndVarianceProgramInfo(inferenceHandler, xLayout);
        var computeOutputProgramInfo = this.createComputOutputProgramInfo(inferenceHandler, xLayout, scaleLayout, bLayout, meanAndVarianceProgramInfo.outputLayout);
        var programInfos = [meanAndVarianceProgramInfo, computeOutputProgramInfo];
        return programInfos;
    };
    WebGLInstanceNormalization.prototype.createRunDatas = function (inferenceHandler, programInfos, inputs) {
        var dataType = inputs[0].type;
        var inputTD = inferenceHandler.getOrCreateTextureData(inputs[0], programInfos[0].inputLayouts[0]);
        var scaleTD = inferenceHandler.getOrCreateTextureData(inputs[1], programInfos[1].inputLayouts[2]);
        var bTD = inferenceHandler.getOrCreateTextureData(inputs[2], programInfos[1].inputLayouts[3]);
        var runDatas = [];
        runDatas.push({
            inputTextureDatas: [inputTD],
            outputTextureData: inferenceHandler.createTextureDataFromLayout(programInfos[0].outputLayout, dataType),
            uniformData: {}
        });
        runDatas.push({
            inputTextureDatas: [inputTD, runDatas[0].outputTextureData, scaleTD, bTD],
            outputTextureData: inferenceHandler.createTextureDataFromLayout(programInfos[1].outputLayout, dataType),
            uniformData: { 'epsilon': this.epsilon }
        });
        return runDatas;
    };
    return WebGLInstanceNormalization;
}(instance_normalization_1.InstanceNormalization));
exports.WebGLInstanceNormalization = WebGLInstanceNormalization;
//# sourceMappingURL=instance-normalization.js.map