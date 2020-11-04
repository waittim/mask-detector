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
exports.WebGLConcat = void 0;
var concat_1 = require("../../../ops/concat");
var WebGLConcat = /** @class */ (function (_super) {
    __extends(WebGLConcat, _super);
    function WebGLConcat() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLConcat.prototype.run = function (inferenceHandler, inputs) {
        return inferenceHandler.run(this, inputs);
    };
    WebGLConcat.prototype.createProgramInfo = function (handler, inputs) {
        var inputShape = inputs[0].dims.slice();
        if (this.axis >= inputShape.length || this.axis < (-1 * inputShape.length)) {
            throw new Error("axis specified for concat doesn't match input dimensionality");
        }
        if (this.axis < 0) {
            this.axis = inputShape.length + this.axis;
        }
        // ensure all of the non-concatenated axes match each other
        // calculate the shape of the output tensor while we do that
        var outputShape = inputShape.slice(0);
        for (var i = 1; i < inputs.length; i++) {
            var dataNShape = inputs[i].dims.slice();
            for (var axisIndex = 0; axisIndex < inputShape.length; axisIndex++) {
                // add to the placeholder for computing output shape
                if (axisIndex === this.axis) {
                    outputShape[this.axis] += dataNShape[axisIndex];
                }
                // ensure all non-cancatenated axes match each other
                else if (inputShape[axisIndex] !== dataNShape[axisIndex]) {
                    throw new Error("non concat dimensions must match");
                }
            }
        }
        var rank = outputShape.length;
        var getTextureIndexWhereDataResidesMethod = "";
        // in most cases linear search is sufficient, as in most scenarios, only 2 tensors are concatenated
        if (inputs.length < 5) {
            getTextureIndexWhereDataResidesMethod = this.getTextureIndexWhereDataResidesLinearSearch(inputs.length);
        }
        else {
            getTextureIndexWhereDataResidesMethod = this.getTextureIndexWhereDataResidesBinarySearch(inputs.length);
        }
        var fetchDataFromCorrectTextureMethod = this.fetchDataFromCorrectTextureMethod(inputs.length, rank);
        var getValueFromArrayIndexMethod = this.getValueFromArrayIndexMethod(inputs.length);
        var samplers = inputs.map(function (v, i) { return "X" + i; });
        var shaderSource = "\n      " + fetchDataFromCorrectTextureMethod + "\n      " + getValueFromArrayIndexMethod + "\n      " + getTextureIndexWhereDataResidesMethod + "\n      float process(int indices[" + rank + "]) {\n        int textureIndex = getTextureWhereDataResides (indices[" + this.axis + "]);\n\n        if(textureIndex != 0) {\n          indices[" + this.axis + "] = indices[" + this.axis + "] - int(getValueFromArrayIndex(sizeInConcatAxis, textureIndex-int(1)));\n        }\n\n        return fetchDataFromCorrectTexture(textureIndex, indices);\n      }";
        return {
            inputLayouts: inputs.map(function (t) { return handler.getOrCreateTextureLayout(t); }),
            outputLayout: handler.createTextureLayoutFromShape(outputShape),
            samplers: samplers,
            variables: [{ name: 'sizeInConcatAxis', type: 'int', arrayLength: inputs.length }],
            shaderSource: shaderSource,
        };
    };
    WebGLConcat.prototype.createRunData = function (handler, programInfo, inputs) {
        var inputTDs = inputs.map(function (t, i) { return handler.getOrCreateTextureData(t, programInfo.inputLayouts[i]); });
        var sizeInConcatAxis = new Array(programInfo.inputLayouts.length);
        var previousSum = 0;
        for (var i = 0; i < programInfo.inputLayouts.length; ++i) {
            previousSum += programInfo.inputLayouts[i].shape[this.axis];
            sizeInConcatAxis[i] = previousSum;
        }
        var uniformData = { 'sizeInConcatAxis': sizeInConcatAxis };
        return {
            inputTextureDatas: inputTDs,
            outputTextureData: handler.createTextureDataFromLayout(programInfo.outputLayout, inputTDs[0].tensor.type),
            uniformData: uniformData
        };
    };
    WebGLConcat.prototype.getTextureIndexWhereDataResidesLinearSearch = function (numberOfTensors) {
        return "int getTextureWhereDataResides(int index) {\n      for(int i=0; i<" + numberOfTensors + "; i++) {\n          if(index < int(sizeInConcatAxis[i])){\n              return i;\n          }\n        }\n      }";
    };
    // TODO: Implement BinarySearch in GLSL
    WebGLConcat.prototype.getTextureIndexWhereDataResidesBinarySearch = function (numberOfTensors) {
        return this.getTextureIndexWhereDataResidesLinearSearch(numberOfTensors);
    };
    WebGLConcat.prototype.fetchDataFromCorrectTextureMethod = function (numberOfTensors, tensorRank) {
        var codeLines = ["float fetchDataFromCorrectTexture(int textureIndex, int indices[" + tensorRank + "]) {"];
        for (var i = 0; i < numberOfTensors; ++i) {
            if (i === 0) {
                codeLines.push("\t" +
                    ("if (textureIndex == " + i + ") { return _X" + i + "(indices); }"));
            }
            else if (i === numberOfTensors - 1) {
                codeLines.push("\t" +
                    ("else { return _X" + i + "(indices); }"));
            }
            else {
                codeLines.push("\t" +
                    ("else if (textureIndex == " + i + ") { return _X" + i + "(indices); }"));
            }
        }
        codeLines.push("\t" +
            "}");
        return codeLines.join('\n');
    };
    WebGLConcat.prototype.getValueFromArrayIndexMethod = function (arrayRank) {
        var codeLines = ["int getValueFromArrayIndex(int arr[" + arrayRank + "], int index) {"];
        for (var i = 0; i < arrayRank; ++i) {
            if (i === 0) {
                codeLines.push("\t" +
                    ("if (index == " + i + ") { return arr[" + i + "]; }"));
            }
            else if (i === arrayRank - 1) {
                codeLines.push("\t" +
                    ("else { return arr[" + i + "]; }"));
            }
            else {
                codeLines.push("\t" +
                    ("else if (index == " + i + ") { return arr[" + i + "]; }"));
            }
        }
        codeLines.push("\t" +
            "}");
        return codeLines.join('\n');
    };
    return WebGLConcat;
}(concat_1.Concat));
exports.WebGLConcat = WebGLConcat;
//# sourceMappingURL=concat.js.map