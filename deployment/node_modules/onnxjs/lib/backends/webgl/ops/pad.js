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
exports.getPadFunction = exports.WebGLPad = void 0;
var pad_1 = require("../../../ops/pad");
var util_1 = require("../../../util");
var glsl_source_1 = require("../glsl-source");
var WebGLPad = /** @class */ (function (_super) {
    __extends(WebGLPad, _super);
    function WebGLPad() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLPad.prototype.run = function (inferenceHandler, inputs) {
        return inferenceHandler.run(this, inputs);
    };
    WebGLPad.prototype.createProgramInfo = function (inferenceHandler, inputs) {
        var outputShape = util_1.ShapeUtil.padShape(inputs[0].dims.slice(), this.pads);
        var rank = outputShape.length;
        var alayout = inferenceHandler.getOrCreateTextureLayout(inputs[0]);
        var padFunction = getPadFunction(glsl_source_1.getGlsl(inferenceHandler.session.backend.glContext.version), 'A', alayout, this.mode, this.pads, this.value);
        var shaderSource = "\n      " + padFunction + "\n      float process(int[" + rank + "] indices) {\n          return padA(indices);\n      }";
        return {
            inputLayouts: [alayout],
            outputLayout: inferenceHandler.createTextureLayoutFromShape(outputShape),
            samplers: ['A'],
            shaderSource: shaderSource,
        };
    };
    WebGLPad.prototype.createRunData = function (inferenceHandler, programInfo, inputs) {
        var inputTDs = [inferenceHandler.getOrCreateTextureData(inputs[0], programInfo.inputLayouts[0])];
        return {
            inputTextureDatas: inputTDs,
            outputTextureData: inferenceHandler.createTextureDataFromLayout(programInfo.outputLayout, inputTDs[0].tensor.type),
            uniformData: {}
        };
    };
    return WebGLPad;
}(pad_1.Pad));
exports.WebGLPad = WebGLPad;
function getPadFunction(glsl, name, inputLayout, mode, pads, value) {
    switch (mode) {
        case 'constant':
            return getPadConstant(glsl, name, inputLayout.shape, inputLayout.strides, inputLayout.width, inputLayout.height, pads, value);
        case 'reflect':
            return getPadReflect(glsl, name, inputLayout.shape, inputLayout.strides, inputLayout.width, inputLayout.height, pads);
        case 'edge':
            return getPadEdge(glsl, name, inputLayout.shape, inputLayout.strides, inputLayout.width, inputLayout.height, pads);
        default:
            throw new Error('Invalid mode');
    }
}
exports.getPadFunction = getPadFunction;
function getPadConstant(glsl, name, shape, strides, width, height, pads, value) {
    var rank = shape.length;
    var block = '';
    for (var i = rank - 1; i >= 0; --i) {
        block += "\n          k = m[" + i + "] - " + pads[i] + ";\n          if (k < 0)  return constant;\n          if (k >= " + shape[i] + ") return constant;\n          offset += k * " + strides[i] + ";\n          ";
    }
    return "\n        float pad" + name + "(int m[" + rank + "]) {\n          const float constant = float(" + value + ");\n          int offset = 0;\n          int k = 0;\n          " + block + "\n          vec2 coords = offsetToCoords(offset, " + width + ", " + height + ");\n          float value = getColorAsFloat(" + glsl.texture2D + "(" + name + ", coords));\n          return value;\n        }\n        ";
}
function getPadReflect(glsl, name, shape, strides, width, height, pads) {
    var rank = shape.length;
    var block = '';
    for (var i = rank - 1; i >= 0; --i) {
        block += "\n        k = m[" + i + "] - " + pads[i] + ";\n        if (k < 0) { k = -k; }\n        {\n          const int _2n_1 = " + 2 * (shape[i] - 1) + ";\n          k = int( mod( float(k), float(_2n_1) ) ) ;\n          if(k >= " + shape[i] + ") { k = _2n_1 - k; }\n        }\n        offset += k * " + strides[i] + ";\n        ";
    }
    return "\n      float pad" + name + "(int m[" + rank + "]) {\n        int offset = 0;\n        int k = 0;\n        " + block + "\n        vec2 coords = offsetToCoords(offset, " + width + ", " + height + ");\n        float value = getColorAsFloat(" + glsl.texture2D + "(" + name + ", coords));\n        return value;\n      }\n      ";
}
function getPadEdge(glsl, name, shape, strides, width, height, pads) {
    var rank = shape.length;
    var block = '';
    for (var i = rank - 1; i >= 0; --i) {
        block += "\n      k = m[" + i + "] - " + pads[i] + ";\n      if (k < 0)  k = 0;\n      if (k >= " + shape[i] + ") k = " + (shape[i] - 1) + ";\n      offset += k * " + strides[i] + ";\n      ";
    }
    return "\n    float pad" + name + "(int m[" + rank + "]) {\n      int offset = 0;\n      int k = 0;\n      " + block + "\n      vec2 coords = offsetToCoords(offset, " + width + ", " + height + ");\n      float value = getColorAsFloat(" + glsl.texture2D + "(" + name + ", coords));\n      return value;\n    }\n    ";
}
//# sourceMappingURL=pad.js.map