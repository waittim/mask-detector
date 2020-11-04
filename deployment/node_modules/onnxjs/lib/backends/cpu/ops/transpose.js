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
exports.transpose = exports.CpuTranspose = void 0;
var transpose_1 = require("../../../ops/transpose");
var tensor_1 = require("../../../tensor");
var util_1 = require("../../../util");
var CpuTranspose = /** @class */ (function (_super) {
    __extends(CpuTranspose, _super);
    function CpuTranspose() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuTranspose.prototype.run = function (inferenceHandler, inputs) {
        var output = transpose(inputs[0], this.perm);
        return [output];
    };
    return CpuTranspose;
}(transpose_1.Transpose));
exports.CpuTranspose = CpuTranspose;
function transpose(x, perm) {
    var inputDims = x.dims;
    var rank = inputDims.length;
    // determine permutation to use
    // if no permutation was specified in the attributes,
    // the default is [rank-1, ..., 0]
    var finalPerm = new Array(rank);
    if (perm.length === rank) {
        finalPerm = perm;
    }
    else {
        for (var i = 0; i < rank; i++) {
            finalPerm[i] = rank - i - 1;
        }
    }
    var outputDims = new Array(rank);
    var stride = new Array(rank);
    // determine shape of output, as well as stride to be used
    // stride[i] indicates the stride for the input-tensor dimension
    // corresponding to the i-th dimension of the output
    for (var i = 0; i < rank; i++) {
        var inpDim = finalPerm[i];
        outputDims[i] = inputDims[inpDim];
        if (inpDim + 1 < rank) {
            stride[i] = util_1.ShapeUtil.sizeFromDimension(inputDims, inpDim + 1);
        }
        else {
            stride[i] = 1;
        }
    }
    var output = new tensor_1.Tensor(outputDims, x.type);
    var X = x.floatData;
    var Y = output.floatData;
    // partition the permutation into a prefix and the largest suffix such that
    // every axis i in the suffix is mapped to i.
    var numAxesInPrefix = 0; // number of axes in prefix
    var suffixBlocksize = 1; // product of dimensions in the suffix
    var prefixBlocksize = 1; // product of dimensions in the prefix
    var isSuffix = true;
    for (var i = rank - 1; i >= 0; --i) {
        var inpAxis = finalPerm[i];
        if (isSuffix && (inpAxis === i)) {
            suffixBlocksize *= inputDims[inpAxis];
        }
        else {
            isSuffix = false;
            prefixBlocksize *= inputDims[inpAxis];
            ++numAxesInPrefix;
        }
    }
    if (prefixBlocksize === 1) {
        doTransposeSingleBlock(suffixBlocksize, Y, X);
    }
    else if (suffixBlocksize === 1) {
        doTransposeEltWise(numAxesInPrefix, outputDims, prefixBlocksize, stride, Y, X);
    }
    else {
        doTranspose(numAxesInPrefix, outputDims, prefixBlocksize, suffixBlocksize, stride, Y, X);
    }
    return output;
}
exports.transpose = transpose;
// doTranspose: copies source tensor to target, transposing elements.
// the stride vector indicates the transposition.
function doTranspose(numAxes, targetDims, numBlocks, numElementsInBlock, stride, target, source) {
    var targetIndex = new Array(numAxes).fill(0);
    var startSourceIndex = 0;
    var startTargetIndex = 0;
    for (var i = 0; i < numBlocks; ++i) {
        var sizeOffset = util_1.ShapeUtil.indicesToOffset(targetIndex, stride, numAxes);
        util_1.arrayCopyHelper(target, source, startTargetIndex, startSourceIndex + sizeOffset, numElementsInBlock);
        util_1.ShapeUtil.incrementIndex(targetIndex, targetDims, numAxes);
        startTargetIndex += numElementsInBlock;
    }
}
// doTransposeEltWise: specialization of DoTranspose for the
// num_elts_in_block=1 case. copies source tensor to target, transposing
// elements. The stride vector indicates the transposition.
function doTransposeEltWise(numAxes, targetDims, numBlocks, stride, target, source) {
    var targetIndex = new Array(numAxes).fill(0);
    var startTargetIndex = 0;
    for (var i = 0; i < numBlocks; ++i) {
        var sourceOffset = util_1.ShapeUtil.indicesToOffset(targetIndex, stride, numAxes);
        target[startTargetIndex++] = source[sourceOffset];
        util_1.ShapeUtil.incrementIndex(targetIndex, targetDims, numAxes);
    }
}
// doTransposeSingleBlock: specialization of DoTranspose for the num_blocks=1
// case. copies source tensor to target, transposing elements. The stride
// vector indicates the transposition.
function doTransposeSingleBlock(numElementsInBlock, target, source) {
    util_1.arrayCopyHelper(target, source, 0, 0, numElementsInBlock);
}
//# sourceMappingURL=transpose.js.map