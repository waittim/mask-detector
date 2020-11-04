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
exports.WebGLSum = void 0;
var sum_1 = require("../../../ops/sum");
var glsl_source_1 = require("../glsl-source");
var WebGLSum = /** @class */ (function (_super) {
    __extends(WebGLSum, _super);
    function WebGLSum() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLSum.prototype.run = function (inferenceHandler, inputs) {
        return inferenceHandler.run(this, inputs);
    };
    WebGLSum.prototype.createProgramInfo = function (handler, inputs) {
        var glsl = glsl_source_1.getGlsl(handler.session.backend.glContext.version);
        var outputShape = inputs[0].dims.slice();
        var sumLine = inputs.map(function (v, i) { return glsl.texture2D + "(X" + i + ",TexCoords)"; }).join(' + ');
        var samplers = inputs.map(function (v, i) { return "X" + i; });
        return {
            inputLayouts: inputs.map(function (t) { return handler.getOrCreateTextureLayout(t); }),
            outputLayout: handler.createTextureLayoutFromShape(outputShape),
            samplers: samplers,
            shaderSource: "\n      void main() {\n        vec4 result = " + sumLine + ";\n        " + glsl.output + " = result;\n      }",
            hasMain: true
        };
    };
    WebGLSum.prototype.createRunData = function (handler, programInfo, inputs) {
        var inputTDs = inputs.map(function (t, i) { return handler.getOrCreateTextureData(t, programInfo.inputLayouts[i]); });
        return {
            inputTextureDatas: inputTDs,
            outputTextureData: handler.createTextureDataFromLayout(programInfo.outputLayout, inputTDs[0].tensor.type),
            uniformData: {}
        };
    };
    return WebGLSum;
}(sum_1.Sum));
exports.WebGLSum = WebGLSum;
//# sourceMappingURL=sum.js.map