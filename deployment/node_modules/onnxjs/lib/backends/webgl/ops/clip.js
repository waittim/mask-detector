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
exports.WebGLClip = void 0;
var clip_1 = require("../../../ops/clip");
var glsl_source_1 = require("../glsl-source");
var WebGLClip = /** @class */ (function (_super) {
    __extends(WebGLClip, _super);
    function WebGLClip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLClip.prototype.run = function (inferenceHandler, inputs) {
        return inferenceHandler.run(this, inputs);
    };
    WebGLClip.prototype.createProgramInfo = function (handler, inputs) {
        var outputShape = inputs[0].dims.slice();
        var glsl = glsl_source_1.getGlsl(handler.session.backend.glContext.version);
        var shaderSource = "\n      const float min = float(" + this.min + ");\n      const float max = float(" + this.max + ");\n      void main() {\n        float v = " + glsl.texture2D + "(A, TexCoords).r;\n        " + glsl.output + " = vec4(clamp(v, min, max));\n      }\n      ";
        return {
            inputLayouts: [handler.getOrCreateTextureLayout(inputs[0])],
            outputLayout: handler.createTextureLayoutFromShape(outputShape),
            samplers: ['A'],
            shaderSource: shaderSource,
            hasMain: true,
        };
    };
    WebGLClip.prototype.createRunData = function (handler, programInfo, inputs) {
        var inputTDs = [handler.getOrCreateTextureData(inputs[0], programInfo.inputLayouts[0])];
        return {
            inputTextureDatas: inputTDs,
            outputTextureData: handler.createTextureDataFromLayout(programInfo.outputLayout, inputTDs[0].tensor.type),
            uniformData: {}
        };
    };
    return WebGLClip;
}(clip_1.Clip));
exports.WebGLClip = WebGLClip;
//# sourceMappingURL=clip.js.map