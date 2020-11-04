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
exports.softmax = exports.CpuSoftmax = void 0;
var softmax_1 = require("../../../ops/softmax");
var tensor_1 = require("../../../tensor");
var util = __importStar(require("../../../util"));
var CpuSoftmax = /** @class */ (function (_super) {
    __extends(CpuSoftmax, _super);
    function CpuSoftmax() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuSoftmax.prototype.run = function (inferenceHandler, inputs) {
        var output = softmax(inputs[0], this.axis);
        return [output];
    };
    return CpuSoftmax;
}(softmax_1.Softmax));
exports.CpuSoftmax = CpuSoftmax;
function softmax(x, axis) {
    var inputDimensions = x.dims;
    var inputRank = inputDimensions.length;
    axis = util.ShapeUtil.normalizeAxis(axis, inputRank);
    var N = util.ShapeUtil.sizeToDimension(inputDimensions, axis);
    var D = util.ShapeUtil.sizeFromDimension(inputDimensions, axis);
    var X = x.numberData;
    var output = new tensor_1.Tensor(x.dims, x.type);
    var Y = output.numberData;
    for (var i = 0; i < N; i++) {
        // find row offset
        var offset = i * D;
        // find max of each logical row
        var max = Number.MIN_VALUE;
        for (var j = 0; j < D; j++) {
            if (X[offset + j] > max) {
                max = X[offset + j];
            }
        }
        // find normalization scale per row
        var scale = 0;
        for (var j = 0; j < D; j++) {
            var value = X[offset + j] - max;
            Y[offset + j] = Math.exp(value);
            scale += Math.exp(value);
        }
        // perform the softmax normalization
        for (var j = 0; j < D; j++) {
            if (scale === 0) {
                Y[offset + j] = 0;
            }
            else {
                Y[offset + j] /= scale;
            }
        }
    }
    return output;
}
exports.softmax = softmax;
//# sourceMappingURL=softmax.js.map