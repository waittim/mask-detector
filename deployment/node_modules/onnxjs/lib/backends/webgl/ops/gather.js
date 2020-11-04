"use strict";
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
exports.WebGLGather = void 0;
var gather_1 = require("../../../ops/gather");
var util_1 = require("../../../util");
var WebGLGather = /** @class */ (function (_super) {
    __extends(WebGLGather, _super);
    function WebGLGather() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLGather.prototype.run = function (inferenceHandler, inputs) {
        return inferenceHandler.run(this, inputs);
    };
    WebGLGather.prototype.createProgramInfo = function (handler, inputs) {
        var inputShape = inputs[0].dims.slice();
        var indexDataShape = inputs[1].dims.slice();
        var outputShape = new Array(inputShape.length + indexDataShape.length - 1);
        if (outputShape.length === 0) {
            throw Error('A scalar tensor output has not been supported');
        }
        var axis = util_1.ShapeUtil.normalizeAxis(this.axis, inputShape.length);
        var indexCopyOps = [];
        for (var i = 0; i < outputShape.length; i++) {
            // outputShape is divided into three parts: A, B, C
            // |0        axis|  axis + indexDataShape.length |          end|
            // |     A       |             B                 |      C      |
            //
            // inputIdx: [A, inputs[1][B], C]
            if (i < axis) { // A
                outputShape[i] = inputShape[i];
                indexCopyOps.push("inputIdx[" + i + "] = outputIdx[" + i + "];");
            }
            else {
                if (i < axis + indexDataShape.length) { // B
                    outputShape[i] = indexDataShape[i - axis];
                    indexCopyOps.push("indexDataIdx[" + (i - axis) + "] = outputIdx[" + i + "];");
                }
                else { // C
                    outputShape[i] = inputShape[i - indexDataShape.length + 1]; // skip 1 for axis
                    indexCopyOps.push("inputIdx[" + (i - indexDataShape.length + 1) + "] = outputIdx[" + i + "];");
                }
            }
        }
        var orank = outputShape.length;
        var irank = inputShape.length;
        var iDrank = indexDataShape.length;
        var shaderSource = "\n      float process(int outputIdx[" + orank + "]) {\n        int inputIdx[" + irank + "];\n        int indexDataIdx[" + iDrank + "];\n        " + indexCopyOps.join('\n        ') + "\n        int idx = int(_B(indexDataIdx));\n        inputIdx[" + axis + "] = idx < 0 ? idx + " + inputShape[axis] + " : idx;\n        return _A(inputIdx);\n      }";
        return {
            inputLayouts: inputs.map(function (t) { return handler.getOrCreateTextureLayout(t); }),
            outputLayout: handler.createTextureLayoutFromShape(outputShape),
            samplers: ['A', 'B'],
            shaderSource: shaderSource,
        };
    };
    WebGLGather.prototype.createRunData = function (handler, programInfo, inputs) {
        var inputTDs = inputs.map(function (t, i) { return handler.getOrCreateTextureData(t, programInfo.inputLayouts[i]); });
        return {
            inputTextureDatas: inputTDs,
            outputTextureData: handler.createTextureDataFromLayout(programInfo.outputLayout, inputTDs[0].tensor.type),
            uniformData: {}
        };
    };
    return WebGLGather;
}(gather_1.Gather));
exports.WebGLGather = WebGLGather;
//# sourceMappingURL=gather.js.map