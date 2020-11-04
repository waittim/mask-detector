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
exports.WebGLTranspose = void 0;
var transpose_1 = require("../../../ops/transpose");
var util_1 = require("../../../util");
var glsl_definitions_1 = require("../glsl-definitions");
var WebGLTranspose = /** @class */ (function (_super) {
    __extends(WebGLTranspose, _super);
    function WebGLTranspose() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLTranspose.prototype.run = function (inferenceHandler, inputs) {
        return inferenceHandler.run(this, inputs);
    };
    WebGLTranspose.prototype.getOutputShape = function (inputShapes) {
        var perm = this.getAdjustedPerm(inputShapes[0]);
        return util_1.ShapeUtil.sortBasedOnPerm(inputShapes[0], perm);
    };
    WebGLTranspose.prototype.createProgramInfo = function (handler, inputs) {
        var inputShapes = inputs.map(function (t) { return t.dims.slice(); });
        var perm = this.getAdjustedPerm(inputShapes[0]);
        var unpackedOutputShape = this.getOutputShape(inputShapes);
        var rank = inputs[0].dims.length;
        // A dims=[${inputs[0].dims.toString()}]
        // out Dims=[${unpackedOutputShape.toString()}]
        // based on perm=[${perm.toString()}]
        var shaderSource = "\n      " + this.getPermFunctionBody('perm', perm, rank) + "\n      float process(int indices[" + rank + "]) {\n        int a[" + rank + "];\n        perm(a, indices);\n        return _A(a);\n      }";
        var outputLayout = handler.createTextureLayoutFromShape(unpackedOutputShape, 1, unpackedOutputShape);
        return { inputLayouts: [handler.getOrCreateTextureLayout(inputs[0])], outputLayout: outputLayout, samplers: ['A'], shaderSource: shaderSource };
    };
    WebGLTranspose.prototype.createRunData = function (handler, programInfo, inputs) {
        var inputTDs = [handler.getOrCreateTextureData(inputs[0], programInfo.inputLayouts[0])];
        return {
            inputTextureDatas: inputTDs,
            outputTextureData: handler.createTextureDataFromLayout(programInfo.outputLayout, inputTDs[0].tensor.type),
            uniformData: {}
        };
    };
    WebGLTranspose.prototype.getPositionalFunction = function (handler, inputShape, name) {
        var outputShape = this.getOutputShape([inputShape]);
        if (!name) {
            name = 'perm';
        }
        return {
            name: name,
            body: this.getPermFunctionBody(name, this.getAdjustedPerm(inputShape), outputShape.length),
            type: glsl_definitions_1.FunctionType.Positional,
            inputShape: inputShape,
            outputShape: outputShape
        };
    };
    WebGLTranspose.prototype.getAdjustedPerm = function (inputShape) {
        var perm = this.perm;
        if (perm && perm.length !== inputShape.length) {
            perm = __spread((inputShape.keys())).reverse();
        }
        return perm;
    };
    WebGLTranspose.prototype.getPermFunctionBody = function (name, perm, rank) {
        var reverseFunc = [];
        reverseFunc.push("void " + name + "(out int a[" + rank + "], int src[" + rank + "]) {");
        for (var i = 0; i < rank; ++i) {
            reverseFunc.push("\ta[" + perm[i] + "]=src[" + i + "];");
        }
        reverseFunc.push('\t}');
        return reverseFunc.join('\n');
    };
    return WebGLTranspose;
}(transpose_1.Transpose));
exports.WebGLTranspose = WebGLTranspose;
//# sourceMappingURL=transpose.js.map