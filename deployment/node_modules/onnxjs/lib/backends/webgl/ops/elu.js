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
exports.WebGLElu = void 0;
var elu_1 = require("../../../ops/elu");
var glsl_source_1 = require("../glsl-source");
var WebGLElu = /** @class */ (function (_super) {
    __extends(WebGLElu, _super);
    function WebGLElu() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLElu.prototype.run = function (inferenceHandler, inputs) {
        return inferenceHandler.run(this, inputs);
    };
    WebGLElu.prototype.createProgramInfo = function (handler, inputs) {
        var outputShape = inputs[0].dims.slice();
        var glsl = glsl_source_1.getGlsl(handler.session.backend.glContext.version);
        var shaderSource = "\n      void main() {\n        float v = " + glsl.texture2D + "(A, TexCoords).r;\n        " + glsl.output + " = vec4(v >= 0.0 ? v: (exp(v) - 1.0) * " + this.alpha.toExponential() + "); /* float number format */\n      }\n      ";
        return {
            inputLayouts: [handler.getOrCreateTextureLayout(inputs[0])],
            outputLayout: handler.createTextureLayoutFromShape(outputShape),
            samplers: ['A'],
            shaderSource: shaderSource,
            hasMain: true,
        };
    };
    WebGLElu.prototype.createRunData = function (handler, programInfo, inputs) {
        var inputTDs = [handler.getOrCreateTextureData(inputs[0], programInfo.inputLayouts[0])];
        return {
            inputTextureDatas: inputTDs,
            outputTextureData: handler.createTextureDataFromLayout(programInfo.outputLayout, inputTDs[0].tensor.type),
            uniformData: {}
        };
    };
    return WebGLElu;
}(elu_1.Elu));
exports.WebGLElu = WebGLElu;
//# sourceMappingURL=elu.js.map