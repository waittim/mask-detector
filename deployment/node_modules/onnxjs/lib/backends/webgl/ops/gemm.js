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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebGLGemm = void 0;
var gemm_1 = require("../../../ops/gemm");
var util_1 = require("../../../util");
var WebGLGemm = /** @class */ (function (_super) {
    __extends(WebGLGemm, _super);
    function WebGLGemm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLGemm.prototype.run = function (inferenceHandler, inputs) {
        return inferenceHandler.run(this, inputs);
    };
    WebGLGemm.prototype.createProgramInfo = function (inferenceHandler, inputs) {
        var aShape = inputs[0].dims.slice();
        var bShape = inputs[1].dims.slice();
        var _a = __read(util_1.GemmUtil.getShapeOfGemmResult(aShape, this.transA, bShape, this.transB, inputs.length === 3 ? inputs[2].dims : undefined), 2), M = _a[0], N = _a[1];
        var oShape = [M, N];
        if (!oShape) {
            throw new Error('Can\'t use gemm on the given tensors');
        }
        var sharedDim = aShape[aShape.length - 1];
        var line = '';
        if (this.transA) {
            sharedDim = aShape[0];
        }
        if (this.transA && this.transB) {
            line = "value += _A_T(a) * _B_T(b);";
        }
        else if (this.transA && !this.transB) {
            line = "value += _A_T(a) * _B(b);";
        }
        else if (!this.transA && this.transB) {
            line = "value += _A(a) * _B_T(b);";
        }
        else if (!this.transA && !this.transB) {
            line = "value += _A(a) * _B(b);";
        }
        var rank = oShape.length;
        var declareC = inputs.length === 3 ? "int c[" + inputs[2].dims.length + "];" : '';
        var broadcastC = inputs.length === 3 ? "bcastIndices_C(indices, c);" : '';
        var calculateC = inputs.length === 3 ? "value += beta * _C(c);" : '';
        var shaderSource = "\n      float process(int indices[" + rank + "]) {\n          int a[" + rank + "];\n          int b[" + rank + "];\n          " + declareC + "\n\n          copyVec(indices, a);\n          copyVec(indices, b);\n          " + broadcastC + "\n\n          float value = 0.0;\n          for (int k=0; k<" + sharedDim + "; ++k) {\n              a[" + (rank - 1) + "] = k;\n              b[" + (rank - 2) + "] = k;\n              " + line + "\n          }\n\n          value = value * alpha;\n          " + calculateC + "\n          return value;\n      }";
        var inputLayouts = inputs.map(function (t) { return inferenceHandler.getOrCreateTextureLayout(t); });
        return {
            inputLayouts: inputLayouts,
            outputLayout: inferenceHandler.createTextureLayoutFromShape(oShape),
            samplers: inputs.length === 3 ? ['A', 'B', 'C'] : ['A', 'B'],
            variables: [{ name: 'alpha', type: 'float' }, { name: 'beta', type: 'float' }],
            shaderSource: shaderSource,
        };
    };
    WebGLGemm.prototype.createRunData = function (inferenceHandler, programInfo, inputs) {
        var inputTDs = inputs.map(function (t, i) { return inferenceHandler.getOrCreateTextureData(t, programInfo.inputLayouts[i]); });
        return {
            inputTextureDatas: inputTDs,
            outputTextureData: inferenceHandler.createTextureDataFromLayout(programInfo.outputLayout, inputTDs[0].tensor.type),
            uniformData: { 'alpha': this.alpha, 'beta': this.beta }
        };
    };
    return WebGLGemm;
}(gemm_1.Gemm));
exports.WebGLGemm = WebGLGemm;
//# sourceMappingURL=gemm.js.map