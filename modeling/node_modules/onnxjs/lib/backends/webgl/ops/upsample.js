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
exports.WebGLUpsample = void 0;
var upsample_1 = require("../../../ops/upsample");
var glsl_source_1 = require("../glsl-source");
var WebGLUpsample = /** @class */ (function (_super) {
    __extends(WebGLUpsample, _super);
    function WebGLUpsample() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLUpsample.prototype.run = function (inferenceHandler, inputs) {
        return inferenceHandler.run(this, inputs);
    };
    WebGLUpsample.prototype.createProgramInfo = function (handler, inputs) {
        var _this = this;
        var inputLayout = handler.getOrCreateTextureLayout(inputs[0]);
        var outputShape = inputs[0].dims.map(function (dim, i) { return Math.floor(dim * _this.scales[i]); });
        var outputLayout = handler.createTextureLayoutFromShape(outputShape);
        var dim = outputShape.length;
        var glsl = glsl_source_1.getGlsl(handler.session.backend.glContext.version);
        var outputPitches = new Array(dim);
        var inputPitches = new Array(dim);
        var precalculatedPitches = "\n      int output_pitches[" + dim + "];\n      int input_pitches[" + dim + "];\n      ";
        for (var d = dim - 1; d >= 0; d--) {
            outputPitches[d] = (d === dim - 1) ? 1 : outputPitches[d + 1] * outputShape[d + 1];
            inputPitches[d] = (d === dim - 1) ? 1 : inputPitches[d + 1] * inputs[0].dims[d + 1];
            precalculatedPitches += "\n      output_pitches[" + d + "] = " + outputPitches[d] + ";\n      input_pitches[" + d + "] = " + inputPitches[d] + ";\n      ";
        }
        var getInputFloatFunction = "\n    float getInputFloat(int index) {\n      vec2 coords = offsetToCoords(index, " + inputLayout.width + ", " + inputLayout.height + ");\n      float value = getColorAsFloat(" + glsl.texture2D + "(X, coords));\n      return value;\n    }\n    ";
        var shaderSource = this.mode === 'nearest' ?
            // nearest
            "\n      " + getInputFloatFunction + "\n      float process(int indices[" + dim + "]) {\n        int input_index = 0;\n        int output_index = coordsToOffset(TexCoords, " + outputLayout.width + ", " + outputLayout.height + ");\n\n        " + precalculatedPitches + "\n\n        int d, m;\n        for (int dim = 0; dim < " + dim + "; ++dim) {\n          d = output_index / output_pitches[dim];\n          m = output_index - d * output_pitches[dim];\n          output_index = m;\n\n          if (scales[dim] != 1 && d > 0) {\n            int d2 = d / scales[dim];\n            m = d - d2 * scales[dim];\n            d = d2;\n          }\n          input_index += input_pitches[dim] * d;\n        }\n\n        return getInputFloat(input_index);\n      }" :
            dim === 4 ?
                // bilinear 4D
                "\n      " + getInputFloatFunction + "\n      float process(int indices[4]) {\n        int input_index = 0;\n        int output_index = coordsToOffset(TexCoords, " + outputLayout.width + ", " + outputLayout.height + ");\n\n        " + precalculatedPitches + "\n\n        int m;\n        int index_of_dim0, index_of_dim1, index_of_dim2, index_of_dim3;\n        index_of_dim0 = output_index / output_pitches[0];\n        m = output_index - index_of_dim0 * output_pitches[0];\n        index_of_dim1 = m / output_pitches[1];\n        m = m - index_of_dim1 * output_pitches[1];\n        index_of_dim2 = m / output_pitches[2];\n        m = m - index_of_dim2 * output_pitches[2];\n        index_of_dim3 = m;\n\n        int index_of_input_dim2, index_of_input_dim3, x_offset, y_offset;\n        index_of_input_dim2 = index_of_dim2 / scales[2];\n        y_offset = index_of_dim2 - index_of_input_dim2 * scales[2];\n        index_of_input_dim3 = index_of_dim3 / scales[3];\n        x_offset = index_of_dim3 - index_of_input_dim3 * scales[3];\n\n        input_index = index_of_dim0 * input_pitches[0] +\n                      index_of_dim1 * input_pitches[1] +\n                      index_of_input_dim2 * input_pitches[2] +\n                      index_of_input_dim3;\n\n        float x00 = getInputFloat(input_index);\n        float x10, x01, x11;\n\n        bool end_of_dim2 = false;\n        if (index_of_input_dim2 == (" + inputs[0].dims[2] + " - 1)) {\n          // It's the end in dimension 2\n          x01 = x00;\n          end_of_dim2 = true;\n        } else {\n          x01 = getInputFloat(input_index + input_pitches[2]);\n        }\n\n        if (index_of_input_dim3 == (input_pitches[2] - 1)) {\n          // It's the end in dimension 3\n          x10 = x00;\n          x11 = x01;\n        }\n        else {\n          x10 = getInputFloat(input_index + 1);\n          x11 = end_of_dim2 ? x10 : getInputFloat(input_index + input_pitches[2] + 1);\n        }\n\n        float y0 = x00 + float(y_offset) * (x01 - x00) / float(scales[2]);\n        float y1 = x10 + float(y_offset) * (x11 - x10) / float(scales[2]);\n        return y0 + float(x_offset) * (y1 - y0) / float(scales[3]);\n      }" :
                // bilinear 2D
                "\n      " + getInputFloatFunction + "\n      float process(int indices[2]) {\n        int input_index = 0;\n        int output_index = coordsToOffset(TexCoords, " + outputLayout.width + ", " + outputLayout.height + ");\n\n        " + precalculatedPitches + "\n\n        int m;\n        int index_of_dim0, index_of_dim1;\n        index_of_dim0 = output_index / output_pitches[0];\n        m = output_index - index_of_dim0 * output_pitches[0];\n        index_of_dim1 = m;\n\n        int index_of_input_dim0, index_of_input_dim1, x_offset, y_offset;\n        index_of_input_dim0 = index_of_dim0 / scales[0];\n        y_offset = index_of_dim0 - index_of_input_dim0 * scales[0];\n        index_of_input_dim1 = index_of_dim1 / scales[1];\n        x_offset = index_of_dim1 - index_of_input_dim1 * scales[1];\n\n        input_index = index_of_input_dim0 * input_pitches[0] + index_of_input_dim1;\n\n        float x00 = getInputFloat(input_index);\n        float x10, x01, x11;\n\n        bool end_of_dim0 = false;\n        if (index_of_input_dim0 == (" + inputs[0].dims[0] + " - 1)) {\n          // It's the end in dimension 0\n          x01 = x00;\n          end_of_dim0 = true;\n        } else {\n          x01 = getInputFloat(input_index + input_pitches[0]);\n        }\n\n        if (index_of_input_dim1 == (input_pitches[0] - 1)) {\n          // It's the end in dimension 1\n          x10 = x00;\n          x11 = x01;\n        }\n        else {\n          x10 = getInputFloat(input_index + 1);\n          x11 = end_of_dim0 ? x10 : getInputFloat(input_index + input_pitches[0] + 1);\n        }\n\n        float y0 = x00 + float(y_offset) * (x01 - x00) / float(scales[0]);\n        float y1 = x10 + float(y_offset) * (x11 - x10) / float(scales[0]);\n        return y0 + float(x_offset) * (y1 - y0) / float(scales[1]);\n      }";
        return {
            inputLayouts: [inputLayout],
            outputLayout: outputLayout,
            samplers: ['X'],
            shaderSource: shaderSource,
            variables: [{ name: 'scales', type: 'int', arrayLength: this.scales.length }]
        };
    };
    WebGLUpsample.prototype.createRunData = function (handler, programInfo, inputs) {
        var inputTDs = inputs.map(function (t, i) { return handler.getOrCreateTextureData(t, programInfo.inputLayouts[i]); });
        return {
            inputTextureDatas: inputTDs,
            outputTextureData: handler.createTextureDataFromLayout(programInfo.outputLayout, inputTDs[0].tensor.type),
            uniformData: { scales: this.scales.map(function (x) { return Math.ceil(x); }) }
        };
    };
    return WebGLUpsample;
}(upsample_1.Upsample));
exports.WebGLUpsample = WebGLUpsample;
//# sourceMappingURL=upsample.js.map