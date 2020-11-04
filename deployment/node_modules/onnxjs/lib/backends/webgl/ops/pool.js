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
exports.offsetToIndices = exports.copyArray = exports.GeneratePoolingCode = exports.WebGLMaxPool = exports.WebGLGlobalMaxPool = exports.WebGLAveragePool = exports.WebGLGlobalAveragePool = void 0;
var pool_1 = require("../../../ops/pool");
var util_1 = require("../../../util");
var WebGLGlobalAveragePool = /** @class */ (function (_super) {
    __extends(WebGLGlobalAveragePool, _super);
    function WebGLGlobalAveragePool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLGlobalAveragePool.prototype.run = function (inferenceHandler, inputs) {
        return inferenceHandler.run(this, inputs);
    };
    WebGLGlobalAveragePool.prototype.createProgramInfo = function (inferenceHandler, inputs) {
        return createAveragePoolProgramInfo(inferenceHandler, inputs, true, this.kernelShape, this.autoPad, this.strides, this.pads, this.countIncludePad);
    };
    WebGLGlobalAveragePool.prototype.createRunData = function (inferenceHandler, programInfo, inputs) {
        var inputTDs = [inferenceHandler.getOrCreateTextureData(inputs[0], programInfo.inputLayouts[0])];
        return {
            inputTextureDatas: inputTDs,
            outputTextureData: inferenceHandler.createTextureDataFromLayout(programInfo.outputLayout, inputTDs[0].tensor.type),
            uniformData: {}
        };
    };
    return WebGLGlobalAveragePool;
}(pool_1.GlobalAveragePool));
exports.WebGLGlobalAveragePool = WebGLGlobalAveragePool;
var WebGLAveragePool = /** @class */ (function (_super) {
    __extends(WebGLAveragePool, _super);
    function WebGLAveragePool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLAveragePool.prototype.run = function (inferenceHandler, inputs) {
        return inferenceHandler.run(this, inputs);
    };
    WebGLAveragePool.prototype.createProgramInfo = function (inferenceHandler, inputs) {
        return createAveragePoolProgramInfo(inferenceHandler, inputs, false, this.kernelShape, this.autoPad, this.strides, this.pads, this.countIncludePad);
    };
    WebGLAveragePool.prototype.createRunData = function (inferenceHandler, programInfo, inputs) {
        var inputTDs = [inferenceHandler.getOrCreateTextureData(inputs[0], programInfo.inputLayouts[0])];
        return {
            inputTextureDatas: inputTDs,
            outputTextureData: inferenceHandler.createTextureDataFromLayout(programInfo.outputLayout, inputTDs[0].tensor.type),
            uniformData: {}
        };
    };
    return WebGLAveragePool;
}(pool_1.AveragePool));
exports.WebGLAveragePool = WebGLAveragePool;
function createAveragePoolProgramInfo(inferenceHandler, inputs, isGlobalOperator, kernelShape, autoPad, strides, pads, countIncludePad) {
    if (kernelShape === void 0) { kernelShape = []; }
    if (autoPad === void 0) { autoPad = ''; }
    if (strides === void 0) { strides = []; }
    if (pads === void 0) { pads = []; }
    var inputShape = inputs[0].dims.slice();
    util_1.PoolConvUtil.adjustPoolAttributes(isGlobalOperator, inputShape, kernelShape, strides, pads);
    var outputShape = util_1.PoolConvUtil.computePoolOutputShape(isGlobalOperator, inputShape, strides, kernelShape, pads, autoPad);
    var kernelSize = util_1.ShapeUtil.size(kernelShape);
    var op1 = "value += _X(x);";
    var op2 = "";
    if (countIncludePad) {
        op2 += "value /= float(" + kernelSize + ");";
    }
    else {
        op2 += "value /= float(" + kernelSize + " - pad);";
    }
    var inputLayout = inferenceHandler.getOrCreateTextureLayout(inputs[0]);
    var poolingCode = GeneratePoolingCode(inputLayout, kernelShape, pads, strides, op1, op2, '0.0');
    var shaderSource = "\n      " + poolingCode + "\n    ";
    return {
        inputLayouts: [inputLayout],
        outputLayout: inferenceHandler.createTextureLayoutFromShape(outputShape),
        samplers: ['X'],
        shaderSource: shaderSource,
    };
}
var WebGLGlobalMaxPool = /** @class */ (function (_super) {
    __extends(WebGLGlobalMaxPool, _super);
    function WebGLGlobalMaxPool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLGlobalMaxPool.prototype.run = function (inferenceHandler, inputs) {
        return inferenceHandler.run(this, inputs);
    };
    WebGLGlobalMaxPool.prototype.createProgramInfo = function (inferenceHandler, inputs) {
        return createMaxPoolProgramInfo(inferenceHandler, inputs, true, this.kernelShape, this.autoPad, this.strides, this.pads);
    };
    WebGLGlobalMaxPool.prototype.createRunData = function (inferenceHandler, programInfo, inputs) {
        var inputTDs = [inferenceHandler.getOrCreateTextureData(inputs[0])];
        return {
            inputTextureDatas: inputTDs,
            outputTextureData: inferenceHandler.createTextureDataFromLayout(programInfo.outputLayout, inputTDs[0].tensor.type),
            uniformData: {}
        };
    };
    return WebGLGlobalMaxPool;
}(pool_1.GlobalMaxPool));
exports.WebGLGlobalMaxPool = WebGLGlobalMaxPool;
var WebGLMaxPool = /** @class */ (function (_super) {
    __extends(WebGLMaxPool, _super);
    function WebGLMaxPool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLMaxPool.prototype.run = function (inferenceHandler, inputs) {
        return inferenceHandler.run(this, inputs);
    };
    WebGLMaxPool.prototype.createProgramInfo = function (inferenceHandler, inputs) {
        return createMaxPoolProgramInfo(inferenceHandler, inputs, false, this.kernelShape, this.autoPad, this.strides, this.pads);
    };
    WebGLMaxPool.prototype.createRunData = function (inferenceHandler, programInfo, inputs) {
        var inputTDs = [inferenceHandler.getOrCreateTextureData(inputs[0])];
        return {
            inputTextureDatas: inputTDs,
            outputTextureData: inferenceHandler.createTextureDataFromLayout(programInfo.outputLayout, inputTDs[0].tensor.type),
            uniformData: {}
        };
    };
    return WebGLMaxPool;
}(pool_1.MaxPool));
exports.WebGLMaxPool = WebGLMaxPool;
function createMaxPoolProgramInfo(inferenceHandler, inputs, isGlobalOperator, kernelShape, autoPad, strides, pads) {
    if (kernelShape === void 0) { kernelShape = []; }
    if (autoPad === void 0) { autoPad = ''; }
    if (strides === void 0) { strides = []; }
    if (pads === void 0) { pads = []; }
    var inputShape = inputs[0].dims.slice();
    util_1.PoolConvUtil.adjustPoolAttributes(isGlobalOperator, inputShape, kernelShape, strides, pads);
    var outputShape = util_1.PoolConvUtil.computePoolOutputShape(isGlobalOperator, inputShape, strides, kernelShape, pads, autoPad);
    var op1 = "\n              value = max(_X(x), value);\n      ";
    var op2 = "";
    var inputLayout = inferenceHandler.createTextureLayoutFromShape(inputShape);
    var poolingCode = GeneratePoolingCode(inputLayout, kernelShape, pads, strides, op1, op2, '-1e5');
    var shaderSource = "\n    " + poolingCode + "\n  ";
    return {
        inputLayouts: [inputLayout],
        outputLayout: inferenceHandler.createTextureLayoutFromShape(outputShape),
        samplers: ['X'],
        shaderSource: shaderSource,
    };
}
function GeneratePoolingCode(x, kernelShape, pads, strides, op1, op2, startVal) {
    var inputDims = x.shape;
    var rank = x.shape.length;
    if (kernelShape.length <= 2) {
        var kw = kernelShape[kernelShape.length - 1];
        var sw = strides[strides.length - 1];
        var pwStart = pads[pads.length / 2 - 1];
        var pwEnd = pads[pads.length - 1];
        var dimW = inputDims[rank - 1];
        var codeW = "";
        var codeH = "";
        var codeHEnd = "";
        if (pwStart + pwEnd !== 0) {
            codeW = "\n                for (int i = 0; i < " + kw + "; i++) {\n                  x[" + rank + " - 1] = indices[" + rank + " - 1] * " + sw + " - " + pwStart + " + i;\n                  if (x[" + rank + " - 1] < 0 || x[" + rank + " - 1] >= " + dimW + ") {\n                    pad++;\n                    continue;\n                  }\n                  " + op1 + "\n                }";
        }
        else {
            codeW = "\n                for (int i = 0; i < " + kw + "; i++) {\n                  x[" + rank + " - 1] = indices[" + rank + " - 1] * " + sw + " - " + pwStart + " + i;\n                  " + op1 + "\n                }";
        }
        if (kernelShape.length === 2) {
            var kh = kernelShape[kernelShape.length - 2];
            var sh = strides[strides.length - 2];
            var phStart = pads[pads.length / 2 - 2];
            var phEnd = pads[pads.length - 2];
            var dimH = inputDims[rank - 2];
            if (phStart + phEnd !== 0) {
                codeH = "\n              for (int j = 0; j < " + kh + "; j++) {\n                x[" + rank + " - 2] = indices[" + rank + " - 2] * " + sh + " - " + phStart + " + j;\n                if (x[" + rank + " - 2] < 0 || x[" + rank + " - 2] >= " + dimH + ") {\n                  pad+= " + kw + ";\n                  continue;\n                }\n            ";
            }
            else {
                codeH = "\n                for (int j = 0; j < " + kh + "; j++) {\n                  x[" + rank + " - 2] = indices[" + rank + " - 2] * " + sh + " - " + phStart + " + j;\n                ";
            }
            codeHEnd = "\n              }\n            ";
        }
        var poolingCode = "\n            float process(int indices[" + rank + "]) {\n              int x[" + rank + "];\n              copyVec(indices, x);\n\n              float value = " + startVal + ";\n              int pad = 0;\n              " + codeH + "\n              " + codeW + "\n              " + codeHEnd + "\n              " + op2 + "\n              return value;\n            }\n          ";
        return poolingCode;
    }
    else {
        var kernelSize = util_1.ShapeUtil.size(kernelShape);
        var kernelStrides = util_1.ShapeUtil.computeStrides(kernelShape);
        var stridesRank = kernelStrides.length;
        var padsRank = pads.length;
        var offsetToIndicesFunction = offsetToIndices(stridesRank);
        var copyInputDims = copyArray(inputDims, 'inputDims');
        var copyPads = copyArray(pads, 'pads');
        var copyKernelStrides = copyArray(kernelStrides, 'kernelStrides');
        var copyStrides = copyArray(strides, 'strides');
        var hasPads = pads.reduce(function (sum, cur) { return sum + cur; });
        var padCode = "";
        if (hasPads) {
            padCode = "\n                if (x[j] >= inputDims[j] || x[j] < 0) {\n                  pad++;\n                  isPad = true;\n                  break;\n                }\n              }\n              if (!isPad) {\n                " + op1 + "\n              }";
        }
        else {
            padCode = "\n                  }\n                  " + op1;
        }
        var poolingCode = "\n            " + offsetToIndicesFunction + "\n            float process(int indices[" + rank + "]) {\n                int x[" + rank + "];\n                copyVec(indices, x);\n                int offset[" + stridesRank + "];\n                int pads[" + padsRank + "];\n                int inputDims[" + rank + "];\n                int kernelStrides[" + stridesRank + "];\n                int strides[" + stridesRank + "];\n                " + copyPads + "\n                " + copyInputDims + "\n                " + copyStrides + "\n                " + copyKernelStrides + "\n\n                float value = " + startVal + ";\n                int pad = 0;\n                bool isPad = false;\n                for (int i = 0; i < " + kernelSize + "; i++) {\n                    offsetToIndices(i, kernelStrides, offset);\n                    isPad = false;\n                    for (int j = " + rank + " - " + stridesRank + "; j < " + rank + "; j++) {\n                      x[j] = indices[j] * strides[j - " + rank + " + " + stridesRank + "]\n                        + offset[j - " + rank + " + " + stridesRank + "] - pads[j - 2];\n                      " + padCode + "\n                }\n                " + op2 + "\n\n                return value;\n            }";
        return poolingCode;
    }
}
exports.GeneratePoolingCode = GeneratePoolingCode;
function copyArray(array, arrayName) {
    var block = "";
    for (var i = 0; i < array.length; i++) {
        block += "\n      " + arrayName + "[" + i + "] = " + array[i] + ";\n    ";
    }
    return block;
}
exports.copyArray = copyArray;
function offsetToIndices(rank) {
    return "\n    void offsetToIndices(int offset, int[" + rank + "] strides, out int[" + rank + "] indices) {\n      if (" + rank + " == 0) {\n        return;\n      }\n      for (int i = 0; i < " + rank + " - 1; ++i) {\n        indices[i] = offset / strides[i];\n        offset -= indices[i] * strides[i];\n      }\n      indices[" + rank + " - 1] = offset;\n    }";
}
exports.offsetToIndices = offsetToIndices;
//# sourceMappingURL=pool.js.map