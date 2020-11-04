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
exports.WebGLMatMul = void 0;
var matmul_1 = require("../../../ops/matmul");
var util_1 = require("../../../util");
var WebGLMatMul = /** @class */ (function (_super) {
    __extends(WebGLMatMul, _super);
    function WebGLMatMul() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLMatMul.prototype.run = function (inferenceHandler, inputs) {
        return inferenceHandler.run(this, inputs);
    };
    WebGLMatMul.prototype.createProgramInfo = function (handler, inputs) {
        var aShape = inputs[0].dims;
        var bShape = inputs[1].dims;
        var outputShape = util_1.BroadcastUtil.calcShape(aShape, bShape, true);
        if (!outputShape) {
            throw new Error('Can\'t use matmul on the given tensors');
        }
        var rank = outputShape.length;
        var arank = aShape.length;
        var brank = bShape.length;
        var sharedDim = aShape[aShape.length - 1];
        var shaderSource = "\n      float process(int indices[" + rank + "]) {\n          int a[" + arank + "];\n          int b[" + brank + "];\n          bcastMatmulIndices_A(indices, a);\n          bcastMatmulIndices_B(indices, b);\n\n          float value;\n          for (int k=0; k<" + sharedDim + "; ++k) {\n              a[" + (arank - 1) + "] = k;\n              b[" + (brank - 2) + "] = k;\n              value += _A(a) * _B(b);\n          }\n          return value;\n      }";
        return {
            inputLayouts: inputs.map(function (t) { return handler.getOrCreateTextureLayout(t); }),
            outputLayout: handler.createTextureLayoutFromShape(outputShape),
            samplers: ['A', 'B'],
            shaderSource: shaderSource,
        };
    };
    WebGLMatMul.prototype.createRunData = function (handler, programInfo, inputs) {
        var inputTDs = inputs.map(function (t, i) { return handler.getOrCreateTextureData(t, programInfo.inputLayouts[i]); });
        return {
            inputTextureDatas: inputTDs,
            outputTextureData: handler.createTextureDataFromLayout(programInfo.outputLayout, inputTDs[0].tensor.type),
            uniformData: {}
        };
    };
    return WebGLMatMul;
}(matmul_1.MatMul));
exports.WebGLMatMul = WebGLMatMul;
//# sourceMappingURL=matmul.js.map