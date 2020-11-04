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
exports.WebGLImageScaler = void 0;
var image_scaler_1 = require("../../../ops/image-scaler");
var WebGLImageScaler = /** @class */ (function (_super) {
    __extends(WebGLImageScaler, _super);
    function WebGLImageScaler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLImageScaler.prototype.run = function (inferenceHandler, inputs) {
        return inferenceHandler.run(this, inputs);
    };
    WebGLImageScaler.prototype.createProgramInfo = function (handler, inputs) {
        var outputShape = inputs[0].dims.slice();
        var rank = outputShape.length;
        var getBiasMethod = this.createGetBiasMethod(this.bias.length);
        var shaderSource = "\n      " + getBiasMethod + "\n      float process(int indices[" + rank + "]) {\n        return _X(indices) * scale + getBias(bias, indices[1]);\n      }";
        return {
            inputLayouts: [handler.getOrCreateTextureLayout(inputs[0])],
            outputLayout: handler.createTextureLayoutFromShape(outputShape),
            samplers: ['X'],
            variables: [{ name: 'bias', type: 'float', arrayLength: this.bias.length }, { name: 'scale', type: 'float' }],
            shaderSource: shaderSource,
        };
    };
    WebGLImageScaler.prototype.createRunData = function (handler, programInfo, inputs) {
        var inputTDs = [handler.getOrCreateTextureData(inputs[0], programInfo.inputLayouts[0])];
        return {
            inputTextureDatas: inputTDs,
            outputTextureData: handler.createTextureDataFromLayout(programInfo.outputLayout, inputTDs[0].tensor.type),
            uniformData: { 'bias': this.bias, 'scale': this.scale }
        };
    };
    WebGLImageScaler.prototype.createGetBiasMethod = function (numChannels) {
        var codeLines = ["float getBias(float bias[" + numChannels + "], int channel) {"];
        for (var i = 0; i < numChannels; ++i) {
            if (i === 0) {
                codeLines.push("\t" +
                    ("if (channel == " + i + ") { return bias[" + i + "]; }"));
            }
            else if (i === numChannels - 1) {
                codeLines.push("\t" +
                    ("else { return bias[" + i + "]; }"));
            }
            else {
                codeLines.push("\t" +
                    ("else if (channel == " + i + ") { return bias[" + i + "]; }"));
            }
        }
        codeLines.push("\t" +
            "}");
        return codeLines.join('\n');
    };
    return WebGLImageScaler;
}(image_scaler_1.ImageScaler));
exports.WebGLImageScaler = WebGLImageScaler;
//# sourceMappingURL=image-scaler.js.map