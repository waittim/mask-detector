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
exports.WebGLSplit = void 0;
var split_1 = require("../../../ops/split");
var util_1 = require("../../../util");
var WebGLSplit = /** @class */ (function (_super) {
    __extends(WebGLSplit, _super);
    function WebGLSplit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLSplit.prototype.run = function (inferenceHandler, inputs) {
        var _this = this;
        if (!this.artifacts) {
            this.artifacts = [];
            var axis = util_1.ShapeUtil.normalizeAxis(this.axis, inputs[0].dims.length);
            var count = this.getProgramCount(inferenceHandler, inputs, axis);
            for (var i = 0; i < count; ++i) {
                var programInfo = this.createProgramInfo(inferenceHandler, inputs[0], axis, i);
                var artifact = inferenceHandler.session.programManager.build(programInfo);
                this.artifacts.push(artifact);
            }
        }
        var results = [];
        this.artifacts.forEach(function (artifact) {
            var rundata = _this.createRunData(inferenceHandler, artifact.programInfo, inputs);
            inferenceHandler.session.programManager.run(artifact, rundata);
            results.push(rundata.outputTextureData.tensor);
        });
        return results;
    };
    WebGLSplit.prototype.getProgramCount = function (inferenceHandler, inputs, axis) {
        var _a = __read(util_1.SplitUtil.splitShape(inputs[0].dims, axis, this.split, this.numOutputs), 2), offsets = _a[1];
        return offsets.length;
    };
    WebGLSplit.prototype.createProgramInfo = function (inferenceHandler, input, axis, index) {
        var _a = __read(util_1.SplitUtil.splitShape(input.dims, axis, this.split, this.numOutputs), 2), shapes = _a[0], offsets = _a[1];
        var offset = offsets[index];
        var outputShape = shapes[index];
        var rank = outputShape.length;
        var shaderSource = "\n      float process(int indices[" + rank + "]) {\n        indices[" + axis + "] += " + offset + ";\n        return _A(indices);\n      }";
        return {
            inputLayouts: [inferenceHandler.getOrCreateTextureLayout(input)],
            outputLayout: inferenceHandler.createTextureLayoutFromShape(outputShape),
            samplers: ['A'],
            shaderSource: shaderSource,
        };
    };
    WebGLSplit.prototype.createRunData = function (inferenceHandler, programInfo, inputs) {
        var inputTDs = [inferenceHandler.getOrCreateTextureData(inputs[0], programInfo.inputLayouts[0])];
        return {
            inputTextureDatas: inputTDs,
            outputTextureData: inferenceHandler.createTextureDataFromLayout(programInfo.outputLayout, inputTDs[0].tensor.type),
            uniformData: {}
        };
    };
    return WebGLSplit;
}(split_1.Split));
exports.WebGLSplit = WebGLSplit;
//# sourceMappingURL=split.js.map