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
exports.WebGLConv = void 0;
var instrument_1 = require("../../../instrument");
var conv_1 = require("../../../ops/conv");
var util_1 = require("../../../util");
var glsl_source_1 = require("../glsl-source");
var WebGLConv = /** @class */ (function (_super) {
    __extends(WebGLConv, _super);
    function WebGLConv() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.readSize = 8;
        _this.blockSize = 64;
        return _this;
    }
    WebGLConv.prototype.run = function (inferenceHandler, inputs) {
        var programManager = inferenceHandler.session.programManager;
        if (!this.artifacts) {
            this.artifacts = [];
            var programInfos = this.createProgramInfos(inferenceHandler, inputs);
            for (var i = 0; i < programInfos.length; ++i) {
                var artifact = inferenceHandler.session.programManager.build(programInfos[i]);
                this.artifacts.push(artifact);
            }
        }
        var runDatas = this.createRunDatas(inferenceHandler, this.artifacts.map(function (a) { return a.programInfo; }), inputs);
        programManager.run(this.artifacts[0], runDatas[0]);
        programManager.run(this.artifacts[1], runDatas[1]);
        return [runDatas[1].outputTextureData.tensor];
    };
    WebGLConv.prototype.createProgramInfos = function (inferenceHandler, inputs) {
        var xshape = inputs[0].dims.slice();
        var kshape = inputs[1].dims.slice();
        // if kernelShape is not specified in the attributes of this op, infer it from the weight tensor dims
        if (this.kernelShape.length === 0) {
            var wDims = inputs[1].dims;
            for (var i = 2; i < wDims.length; ++i) {
                this.kernelShape.push(wDims[i]);
            }
        }
        util_1.PoolConvUtil.adjustPadsBasedOnAutoPad(inputs[0].dims, this.strides, this.dilations, this.kernelShape, this.pads, this.autoPad);
        instrument_1.Logger.verbose('Conv', "autpPad:" + this.autoPad + ", dilations:" + this.dilations + ", group:" + this.group + ", kernelShape:" + this.kernelShape + ", pads:" + this.pads + ", strides:" + this.strides);
        var outputShape = WebGLConv.calcOutputShape(xshape, kshape, this.dilations, this.pads, this.strides);
        var im2colProgramInfo = this.createIm2ColProgramInfo(inferenceHandler, inputs, outputShape);
        var dotProductProgramInfo = this.createDotProductProgramInfo(inferenceHandler, im2colProgramInfo.outputLayout, inputs, outputShape);
        return [im2colProgramInfo, dotProductProgramInfo];
    };
    WebGLConv.prototype.createRunDatas = function (inferenceHandler, programInfos, inputs) {
        var k = inputs[1];
        var b = inputs.length >= 3 ? inputs[2] : undefined;
        var kTD = inferenceHandler.getTextureData(k.dataId);
        if (!kTD) {
            instrument_1.Logger.verbose('Conv', 'Did not find the adjustedKernel texture in the cache. Creating rew.');
            var newKernelData = WebGLConv.prepKernelForDotProduct(k.dims.slice(), this.group, 4, k.floatData);
            // hack: should use graph transformer to rewrite initializer K
            kTD = inferenceHandler.createTextureDataFromLayoutBindTensor(programInfos[1].inputLayouts[1], k.type, newKernelData, k);
        }
        var runtDataIm2Col = {
            inputTextureDatas: [inferenceHandler.getOrCreateTextureData(inputs[0])],
            outputTextureData: inferenceHandler.createTextureDataFromLayout(programInfos[0].outputLayout, inputs[0].type),
            uniformData: {}
        };
        var inputTDs = [runtDataIm2Col.outputTextureData, kTD];
        if (b) {
            inputTDs.push(inferenceHandler.getOrCreateTextureData(b));
        }
        var outputTD = inferenceHandler.createTextureDataFromLayout(programInfos[1].outputLayout, inputs[0].type);
        var runDataDotProduct = {
            inputTextureDatas: inputTDs,
            outputTextureData: outputTD,
            uniformData: {},
            draw: function (glContext, artifact) {
                var gl = glContext.gl;
                var sharedDim = artifact.programInfo.params.sharedDim;
                var sharedDimReadSize = artifact.programInfo.params.sharedDimReadSize;
                var sharedDimOffsetLocation = artifact.uniformLocations.find(function (l) { return l.name === 'sharedDimOffset'; }).location;
                var blend = false;
                for (var k_1 = 0; k_1 < sharedDim; k_1 += sharedDimReadSize) {
                    instrument_1.Logger.verbose('MatMul2D', "k = " + k_1 + ", sharedDim: " + sharedDim + ", readSize = " + sharedDimReadSize);
                    if (k_1 === sharedDimReadSize) {
                        blend = true;
                        gl.enable(gl.BLEND);
                        glContext.checkError();
                        gl.blendEquation(gl.FUNC_ADD);
                        glContext.checkError();
                        gl.blendFunc(gl.ONE, gl.ONE);
                        glContext.checkError();
                    }
                    gl.uniform1i(sharedDimOffsetLocation, k_1);
                    glContext.checkError();
                    glContext.draw();
                }
                if (blend) {
                    gl.disable(gl.BLEND);
                    glContext.checkError();
                }
            }
        };
        return [runtDataIm2Col, runDataDotProduct];
    };
    WebGLConv.prototype.createIm2ColProgramInfo = function (inferenceHandler, inputs, outputShape) {
        var xshape = inputs[0].dims.slice();
        var kshape = inputs[1].dims.slice();
        var rank = outputShape.length;
        var im2colDims = WebGLConv.calcIm2ColDims(xshape, kshape, outputShape, 4);
        var outputLayout = inferenceHandler.createTextureLayoutFromShape(im2colDims, 4, [im2colDims[0], im2colDims[1], im2colDims[2], im2colDims[3] * 4], { breakAxis: 3 });
        var shaderSource = "\n      const int XC = " + xshape[1] + ";\n      const int XH = " + xshape[2] + ";\n      const int XW = " + xshape[3] + ";\n      const int KH = " + this.kernelShape[0] + ";\n      const int KW = " + this.kernelShape[1] + ";\n      const int dilationH = " + this.dilations[0] + ";\n      const int dilationW = " + this.dilations[1] + ";\n      const int strideH = " + this.strides[0] + ";\n      const int strideW = " + this.strides[1] + ";\n      const int padH = " + this.pads[0] + ";\n      const int padW = " + this.pads[1] + ";\n      const int KHKW = KH*KW;\n      const int XCKHKW = XC * KHKW;\n      const int outputChannels = 4;\n\n      vec4 process(int indices[" + rank + "]) {\n        int b  = indices[0]; // batch size\n        int oh = indices[1] * strideH - padH; //output height\n        int ow = indices[2] * strideW - padW; //output width\n        int p = indices[3] * outputChannels; //patch\n        vec4 v = vec4(0.0);\n        for(int i=0; i < outputChannels; ++i) {\n          if(p < XCKHKW) {\n            int patchC = p / KHKW;\n            int patchH = (p - patchC*KHKW) / KW;\n            int patchW = (p - patchC*KHKW) - patchH * KW;\n            int xh2 = oh + patchH * dilationH;\n            int xw2 = ow + patchW * dilationW;\n            int x[" + xshape.length + "];\n            x[0] = b;\n            x[1] = patchC;\n            x[2] = xh2;\n            x[3] = xw2;\n            if(xh2 >= 0 &&\n                xh2 < XH &&\n                xw2 >= 0 &&\n                xw2 < XW) {\n              v[i] = _X(x);\n            }\n          }\n          ++p;\n        }\n        return v;\n      }\n      ";
        return {
            inputLayouts: [inferenceHandler.createTextureLayoutFromShape(xshape)],
            outputLayout: outputLayout,
            samplers: ['X'],
            shaderSource: shaderSource,
        };
    };
    WebGLConv.prototype.createDotProductProgramInfo = function (inferenceHandler, im2colLayout, inputs, outputShape) {
        var xshape = inputs[0].dims.slice();
        var kshape = inputs[1].dims.slice();
        var adjustedKernelShape = [kshape[0], Math.ceil((xshape[1] * kshape[2] * kshape[3]) / 4)];
        var kLayout = inferenceHandler.createTextureLayoutFromShape(adjustedKernelShape, 4, [adjustedKernelShape[0], adjustedKernelShape[1] * 4], { breakAxis: 1 });
        var bLayout;
        var rank = outputShape.length;
        var inputLayouts = [im2colLayout, kLayout];
        if (inputs.length === 3) {
            bLayout = inferenceHandler.createTextureLayoutFromShape(inputs[2].dims.slice());
            inputLayouts.push(bLayout);
        }
        var outputLayout = inferenceHandler.createTextureLayoutFromShape(outputShape);
        var initValue = (inputs.length < 3) ? '0.0' : '_B(b)';
        var sharedDim = im2colLayout.shape[3];
        var blendEnabled = inferenceHandler.session.backend.glContext.isBlendSupported;
        var sharedDimReadSize = blendEnabled && inferenceHandler.session.backend.matmulMaxBatchSize ?
            this.calcSharedDimReadSize(inferenceHandler.session.backend.matmulMaxBatchSize, sharedDim) :
            sharedDim;
        var samplers = ['Im2Col', 'K'];
        if (inputs.length === 3) {
            samplers.push('B');
        }
        var glsl = glsl_source_1.getGlsl(inferenceHandler.session.backend.glContext.version);
        var shaderSource = "\n    float process(int indices[" + rank + "]) {\n      int b[1];\n      b[0] = indices[1];\n      int im2col[" + im2colLayout.shape.length + "];\n      im2col[0] = indices[0];\n      im2col[1] = indices[2];\n      im2col[2] = indices[3];\n      int im2colOffset = im2col[0] * " + im2colLayout.strides[0] + " + im2col[1] * " + im2colLayout.strides[1] + " + im2col[2] * " + im2colLayout.strides[2] + " + sharedDimOffset;\n      int kernelOffset = indices[1] * " + kLayout.strides[0] + " + sharedDimOffset;\n      float sum = sharedDimOffset == 0 ? " + initValue + " : 0.0;\n      for (int i = 0; i < " + sharedDimReadSize + "; ++i) {\n        vec2 im2colCoords = offsetToCoords(im2colOffset, " + im2colLayout.width + ", " + im2colLayout.height + ");\n        vec2 kernelCoords = offsetToCoords(kernelOffset, " + kLayout.width + ", " + kLayout.height + ");\n        sum += dot(" + glsl.texture2D + "(Im2Col, im2colCoords), " + glsl.texture2D + "(K, kernelCoords));\n        ++im2colOffset;\n        ++kernelOffset;\n      }\n      return sum;\n    }";
        return {
            inputLayouts: inputs.length === 3 ? [im2colLayout, kLayout, bLayout] : [im2colLayout, kLayout],
            outputLayout: outputLayout,
            shaderSource: shaderSource,
            samplers: samplers,
            variables: [{ name: 'sharedDimOffset', type: 'int' }],
            params: { 'sharedDim': sharedDim, 'sharedDimReadSize': sharedDimReadSize }
        };
    };
    WebGLConv.prepKernelForDotProduct = function (shape, group, channels, kernel) {
        if (group === 1 && (channels === 1 || (shape[2] * shape[3]) % channels === 0)) {
            return kernel;
        }
        var numFeatureMaps = shape[0];
        var oldRowSize = shape[1] * shape[2] * shape[3];
        var newRowSize = Math.ceil(oldRowSize * group / channels) * channels;
        var newSize = numFeatureMaps * newRowSize;
        var buffer = new Float32Array(newSize);
        for (var f = 0; f < numFeatureMaps; ++f) {
            var oldOffset = f * oldRowSize;
            var newOffset = f * newRowSize + f % group * oldRowSize;
            buffer.set(kernel.subarray(oldOffset, oldOffset + oldRowSize), newOffset);
        }
        return buffer;
    };
    WebGLConv.calcIm2ColDims = function (inputShape, kernelShape, outputShape, channels) {
        if (channels === void 0) { channels = 1; }
        return [
            outputShape[0], outputShape[2], outputShape[3],
            Math.ceil(inputShape[1] * kernelShape[2] * kernelShape[3] / channels)
        ];
    };
    WebGLConv.calcOutputShape = function (inputShape, kernelShape, dilations, adjustPads, strides) {
        var _a;
        var batchSize = inputShape[0];
        var inputSpatialShape = inputShape.slice(2);
        var spatialRank = inputSpatialShape.length;
        var outChannels = kernelShape[0];
        var kernelSpatialShape = kernelShape.slice(2);
        var dilatedKernelShape = kernelSpatialShape.map(function (v, i) { return v + (v - 1) * (dilations[i] - 1); });
        var inputSpatialShapeWithPad = inputSpatialShape.map(function (v, i) { return v + adjustPads[i] + adjustPads[i + spatialRank]; });
        var outputSpatialShape = inputSpatialShapeWithPad.map(function (v, i) { return Math.floor((v - dilatedKernelShape[i] + strides[i]) / strides[i]); });
        var outputShape = (_a = [batchSize, outChannels]).concat.apply(_a, __spread(outputSpatialShape));
        return outputShape;
    };
    WebGLConv.prototype.calcSharedDimReadSize = function (preferredBatchSize, sharedDim) {
        if (preferredBatchSize <= 0 || sharedDim < preferredBatchSize || sharedDim % preferredBatchSize !== 0) {
            return sharedDim;
        }
        return preferredBatchSize;
    };
    WebGLConv.prototype.calcBlockSize = function (outputLayout) {
        var preferredRowCount = 64;
        var preferredColCount = 64;
        if (outputLayout.height < preferredRowCount) {
            return undefined;
        }
        return [preferredColCount, preferredRowCount];
    };
    return WebGLConv;
}(conv_1.Conv));
exports.WebGLConv = WebGLConv;
//# sourceMappingURL=conv.js.map