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
exports.WebGLBatchNormalization = void 0;
var batch_normalization_1 = require("../../../ops/batch-normalization");
var glsl_source_1 = require("../glsl-source");
var WebGLBatchNormalization = /** @class */ (function (_super) {
    __extends(WebGLBatchNormalization, _super);
    function WebGLBatchNormalization() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLBatchNormalization.prototype.run = function (inferenceHandler, inputs) {
        return inferenceHandler.run(this, inputs);
    };
    WebGLBatchNormalization.prototype.createProgramInfo = function (handler, inputs) {
        var inputLayouts = inputs.map(function (t) { return handler.getOrCreateTextureLayout(t); });
        var outputShape = inputs[0].dims.slice();
        var rank = outputShape.length;
        var scale = inputLayouts[1];
        var glsl = glsl_source_1.getGlsl(handler.session.backend.glContext.version);
        var shaderSource = "\n      float process(int[" + rank + "] indices) {\n        vec2 position = offsetToCoords(indices[1], " + scale.width + ", " + scale.height + ");\n        float scale = getColorAsFloat(" + glsl.texture2D + "(Scale, position));\n        float mean = getColorAsFloat(" + glsl.texture2D + "(Mean, position));\n        float variance = getColorAsFloat(" + glsl.texture2D + "(Variance, position));\n        float b = getColorAsFloat(" + glsl.texture2D + "(B, position));\n\n        return scale * ( (_A(indices) - mean) / sqrt(variance + float(" + this.epsilon + ")) ) + b;\n      }";
        return {
            inputLayouts: inputLayouts,
            outputLayout: handler.createTextureLayoutFromShape(outputShape),
            samplers: ['A', 'Scale', 'B', 'Mean', 'Variance'],
            shaderSource: shaderSource
        };
    };
    WebGLBatchNormalization.prototype.createRunData = function (handler, programInfo, inputs) {
        var inputTDs = [handler.getOrCreateTextureData(inputs[0], programInfo.inputLayouts[0])];
        inputs.slice(1).forEach(function (t) { return inputTDs.push(handler.getOrCreateTextureData(t)); });
        var outputTD = handler.createTextureDataFromLayout(programInfo.outputLayout, inputTDs[0].tensor.type);
        return { inputTextureDatas: inputTDs, outputTextureData: outputTD, uniformData: {} };
    };
    return WebGLBatchNormalization;
}(batch_normalization_1.BatchNormalization));
exports.WebGLBatchNormalization = WebGLBatchNormalization;
//# sourceMappingURL=batch-normalization.js.map