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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lrn = exports.CpuLrn = void 0;
var lrn_1 = require("../../../ops/lrn");
var tensor_1 = require("../../../tensor");
var util = __importStar(require("../../../util"));
var CpuLrn = /** @class */ (function (_super) {
    __extends(CpuLrn, _super);
    function CpuLrn() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuLrn.prototype.run = function (inferenceHandler, inputs) {
        var output = lrn(inputs[0], this.alpha, this.beta, this.bias, this.size);
        return [output];
    };
    return CpuLrn;
}(lrn_1.Lrn));
exports.CpuLrn = CpuLrn;
function lrn(x, alpha, beta, bias, size) {
    var N = x.dims[0];
    var C = x.dims[1];
    var X = x.floatData;
    var channelSize = 1;
    for (var i = 2; i < x.dims.length; ++i) {
        channelSize *= x.dims[i];
    }
    var tensorDataSize = channelSize * C;
    // create new tensor to hold the result
    var output = new tensor_1.Tensor(x.dims, x.type);
    var Y = new Array(util.ShapeUtil.size(x.dims));
    // update the output with just the bias to begin with
    for (var i = 0; i < Y.length; ++i) {
        Y[i] = bias;
    }
    // placeholder to store padded square (i.e.) intermediate data
    var paddedSquareSize = (C + size - 1) * channelSize;
    var paddedSquareData = new Float64Array(paddedSquareSize);
    var alphaOverSize = alpha / size;
    var prePad = (size - 1) / 2;
    // go through the images
    for (var n = 0; n < N; ++n) {
        // compute the padded square
        util.MathUtil.sqr(paddedSquareData, X, prePad * channelSize, tensorDataSize * n, tensorDataSize);
        // create the first channel
        for (var c = 0; c < size; ++c) {
            util.MathUtil.axpy(Y, paddedSquareData, tensorDataSize * n, c * channelSize, channelSize, alphaOverSize);
        }
        for (var c = 1; c < C; ++c) {
            var scaleSliceStart = n * tensorDataSize + c * channelSize;
            // copy previous scale
            util.arrayCopyHelper(Y, Y, scaleSliceStart, scaleSliceStart - channelSize, channelSize);
            // add head
            util.MathUtil.axpy(Y, paddedSquareData, scaleSliceStart, (c + size - 1) * channelSize, channelSize, alphaOverSize);
            // subtract tail
            util.MathUtil.axpy(Y, paddedSquareData, scaleSliceStart, (c - 1) * channelSize, channelSize, -alphaOverSize);
        }
    }
    util.MathUtil.powx(Y, Y, 0, 0, util.ShapeUtil.size(x.dims), -beta);
    util.MathUtil.mul(Y, X, 0, 0, util.ShapeUtil.size(x.dims));
    output.floatData.set(Y);
    return output;
}
exports.lrn = lrn;
//# sourceMappingURL=lrn.js.map