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
exports.WebGLLeakyRelu = void 0;
var leaky_relu_1 = require("../../../ops/leaky-relu");
var glsl_source_1 = require("../glsl-source");
var WebGLLeakyRelu = /** @class */ (function (_super) {
    __extends(WebGLLeakyRelu, _super);
    function WebGLLeakyRelu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLLeakyRelu.prototype.run = function (inferenceHandler, inputs) {
        return inferenceHandler.run(this, inputs);
    };
    WebGLLeakyRelu.prototype.createProgramInfo = function (handler, inputs) {
        var outputShape = inputs[0].dims.slice();
        var glsl = glsl_source_1.getGlsl(handler.session.backend.glContext.version);
        var shaderSource = "\n      void main() {\n        float v = " + glsl.texture2D + "(A, TexCoords).r;\n        " + glsl.output + " = vec4(v < 0.0 ? v * float(" + this.alpha + ") : v);\n      }\n      ";
        return {
            hasMain: true,
            inputLayouts: [handler.getOrCreateTextureLayout(inputs[0])],
            outputLayout: handler.createTextureLayoutFromShape(outputShape),
            samplers: ['A'],
            shaderSource: shaderSource,
        };
    };
    WebGLLeakyRelu.prototype.createRunData = function (handler, programInfo, inputs) {
        var inputTDs = [handler.getOrCreateTextureData(inputs[0], programInfo.inputLayouts[0])];
        return {
            inputTextureDatas: inputTDs,
            outputTextureData: handler.createTextureDataFromLayout(programInfo.outputLayout, inputTDs[0].tensor.type),
            uniformData: {}
        };
    };
    return WebGLLeakyRelu;
}(leaky_relu_1.LeakyRelu));
exports.WebGLLeakyRelu = WebGLLeakyRelu;
//# sourceMappingURL=leaky-relu.js.map