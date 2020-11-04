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
exports.reshape = exports.WebGLReshape = void 0;
var reshape_1 = require("../../../ops/reshape");
var util_1 = require("../../../util");
var utils_1 = require("../utils");
var WebGLReshape = /** @class */ (function (_super) {
    __extends(WebGLReshape, _super);
    function WebGLReshape() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLReshape.prototype.run = function (inferenceHandler, inputs) {
        var reshapedDims = util_1.ShapeUtil.calculateReshapedDims(inputs[0].dims, inputs[1].integerData);
        var reshapedTensor = reshape(inferenceHandler, inputs[0], reshapedDims);
        return [reshapedTensor];
    };
    return WebGLReshape;
}(reshape_1.Reshape));
exports.WebGLReshape = WebGLReshape;
function reshape(inferenceHandler, input, reshapedDims) {
    var inputTD = inferenceHandler.getOrCreateTextureData(input);
    var packedShape = reshapedDims;
    if (inputTD.channels === 4) {
        packedShape = utils_1.getPackedShape(reshapedDims);
    }
    var newTextureLayout = {
        channels: inputTD.channels,
        height: inputTD.height,
        width: inputTD.width,
        // handle reshaping into scalar Tensors
        shape: packedShape.length !== 0 ? packedShape : [1],
        strides: util_1.ShapeUtil.computeStrides(packedShape),
        unpackedShape: reshapedDims,
    };
    var newTextureData = inferenceHandler.createSharedTextureData(newTextureLayout, input.type, inputTD.texture, input.dataId);
    return newTextureData.tensor;
}
exports.reshape = reshape;
//# sourceMappingURL=reshape.js.map