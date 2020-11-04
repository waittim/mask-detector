"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
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
exports.WEBGL_OP_RESOLVE_RULES = void 0;
var operators_1 = require("../../operators");
var batch_normalization_1 = require("./ops/batch-normalization");
var binaryOps = __importStar(require("./ops/binary-op"));
var clip_1 = require("./ops/clip");
var concat_1 = require("./ops/concat");
var conv_1 = require("./ops/conv");
var dropout_1 = require("./ops/dropout");
var elu_1 = require("./ops/elu");
var flatten_1 = require("./ops/flatten");
var gather_1 = require("./ops/gather");
var gemm_1 = require("./ops/gemm");
var image_scaler_1 = require("./ops/image-scaler");
var instance_normalization_1 = require("./ops/instance-normalization");
var leaky_relu_1 = require("./ops/leaky-relu");
var matmul_1 = require("./ops/matmul");
var pad_1 = require("./ops/pad");
var pool_1 = require("./ops/pool");
var reduceOps = __importStar(require("./ops/reduce"));
var reshape_1 = require("./ops/reshape");
var slice_1 = require("./ops/slice");
var softmax_1 = require("./ops/softmax");
var split_1 = require("./ops/split");
var squeeze_1 = require("./ops/squeeze");
var sum_1 = require("./ops/sum");
var tile_1 = require("./ops/tile");
var transpose_1 = require("./ops/transpose");
var unaryOps = __importStar(require("./ops/unary-op"));
var unsqueeze_1 = require("./ops/unsqueeze");
var upsample_1 = require("./ops/upsample");
exports.WEBGL_OP_RESOLVE_RULES = [
    ['Abs', '', '6+', function () { return new unaryOps.WebGLUnaryOp(operators_1.NUMBER_TYPES, unaryOps.glslAbs()); }],
    ['Acos', '', '7+', function () { return new unaryOps.WebGLUnaryOp(operators_1.FLOAT_TYPES, unaryOps.glslAcos()); }],
    ['Add', '', '7+', function () { return new binaryOps.WebGLBinaryOp(operators_1.NUMBER_TYPES, binaryOps.glslAdd()); }],
    ['And', '', '7+', function () { return new binaryOps.WebGLBinaryOp(['bool'], binaryOps.glslAnd()); }],
    ['Asin', '', '7+', function () { return new unaryOps.WebGLUnaryOp(operators_1.FLOAT_TYPES, unaryOps.glslAsin()); }],
    ['Atan', '', '7+', function () { return new unaryOps.WebGLUnaryOp(operators_1.FLOAT_TYPES, unaryOps.glslAtan()); }],
    ['AveragePool', '', '7-10', function () { return new pool_1.WebGLAveragePool(); }],
    ['BatchNormalization', '', '7+', function () { return new batch_normalization_1.WebGLBatchNormalization(); }],
    ['Ceil', '', '6+', function () { return new unaryOps.WebGLUnaryOp(operators_1.FLOAT_TYPES, unaryOps.glslCeil()); }],
    ['Clip', '', '6-10', function () { return new clip_1.WebGLClip(); }],
    ['Concat', '', '4+', function () { return new concat_1.WebGLConcat(); }],
    ['Conv', '', '1+', function () { return new conv_1.WebGLConv(); }],
    ['Cos', '', '7+', function () { return new unaryOps.WebGLUnaryOp(operators_1.FLOAT_TYPES, unaryOps.glslCos()); }],
    ['Div', '', '7+', function () { return new binaryOps.WebGLBinaryOp(operators_1.NUMBER_TYPES, binaryOps.glslDiv()); }],
    ['Dropout', '', '7+', function () { return new dropout_1.WebGLDropout(); }],
    ['Equal', '', '7+', function () { return new binaryOps.WebGLBinaryOp(operators_1.NUMBER_TYPES, binaryOps.glslEqual(), undefined, 'bool'); }],
    ['Elu', '', '6+', function () { return new elu_1.WebGLElu(); }],
    ['Exp', '', '6+', function () { return new unaryOps.WebGLUnaryOp(operators_1.FLOAT_TYPES, unaryOps.glslExp()); }],
    ['Flatten', '', '1+', function () { return new flatten_1.WebGLFlatten(); }],
    ['Floor', '', '6+', function () { return new unaryOps.WebGLUnaryOp(operators_1.FLOAT_TYPES, unaryOps.glslFloor()); }],
    ['Gather', '', '1+', function () { return new gather_1.WebGLGather(); }],
    ['Gemm', '', '7-10', function () { return new gemm_1.WebGLGemm(false); }],
    ['Gemm', '', '11+', function () { return new gemm_1.WebGLGemm(true); }],
    ['GlobalAveragePool', '', '1+', function () { return new pool_1.WebGLGlobalAveragePool(); }],
    ['GlobalMaxPool', '', '1+', function () { return new pool_1.WebGLGlobalMaxPool(); }],
    ['Greater', '', '7+', function () { return new binaryOps.WebGLBinaryOp(operators_1.NUMBER_TYPES, binaryOps.glslGreater(), undefined, 'bool'); }],
    ['Identity', '', '1+', function () { return new unaryOps.WebGLUnaryOp(operators_1.NUMBER_TYPES, unaryOps.glslIdentity()); }],
    ['ImageScaler', '', '1+', function () { return new image_scaler_1.WebGLImageScaler(); }],
    ['InstanceNormalization', '', '6+', function () { return new instance_normalization_1.WebGLInstanceNormalization(); }],
    ['LeakyRelu', '', '6+', function () { return new leaky_relu_1.WebGLLeakyRelu(); }],
    ['Less', '', '7+', function () { return new binaryOps.WebGLBinaryOp(operators_1.NUMBER_TYPES, binaryOps.glslLess(), undefined, 'bool'); }],
    ['Log', '', '6+', function () { return new unaryOps.WebGLUnaryOp(operators_1.FLOAT_TYPES, unaryOps.glslLog()); }],
    ['MatMul', '', '1+', function () { return new matmul_1.WebGLMatMul(); }],
    ['MaxPool', '', '1-9', function () { return new pool_1.WebGLMaxPool(); }],
    ['Mul', '', '7+', function () { return new binaryOps.WebGLBinaryOp(operators_1.NUMBER_TYPES, binaryOps.glslMul()); }],
    ['Neg', '', '6+', function () { return new unaryOps.WebGLUnaryOp(operators_1.NUMBER_TYPES, unaryOps.glslNeg()); }],
    ['Not', '', '1+', function () { return new unaryOps.WebGLUnaryOp(['bool'], unaryOps.glslNot()); }],
    ['Or', '', '7+', function () { return new binaryOps.WebGLBinaryOp(['bool'], binaryOps.glslOr()); }],
    ['Pad', '', '2-10', function () { return new pad_1.WebGLPad(); }],
    ['Pow', '', '7+', function () { return new binaryOps.WebGLBinaryOp(operators_1.FLOAT_TYPES, binaryOps.glslPow()); }],
    ['PRelu', '', '7+', function () { return new binaryOps.WebGLBinaryOp(operators_1.FLOAT_TYPES, binaryOps.glslPRelu()); }],
    ['ReduceLogSum', '', '1+', function () { return new reduceOps.WebGLReduceLogSum(); }],
    ['ReduceMax', '', '1+', function () { return new reduceOps.WebGLReduceMax(); }],
    ['ReduceMean', '', '1+', function () { return new reduceOps.WebGLReduceMean(); }],
    ['ReduceMin', '', '1+', function () { return new reduceOps.WebGLReduceMin(); }],
    ['ReduceProd', '', '1+', function () { return new reduceOps.WebGLReduceProd(); }],
    ['ReduceSum', '', '1+', function () { return new reduceOps.WebGLReduceSum(); }],
    ['ReduceSumSquare', '', '1+', function () { return new reduceOps.WebGLReduceSumSquare(); }],
    ['Relu', '', '6+', function () { return new unaryOps.WebGLUnaryOp(operators_1.FLOAT_TYPES, unaryOps.glslRelu()); }],
    ['Reshape', '', '5+', function () { return new reshape_1.WebGLReshape(); }],
    ['Sigmoid', '', '6+', function () { return new unaryOps.WebGLUnaryOp(operators_1.FLOAT_TYPES, unaryOps.glslSigmoid()); }],
    ['Sin', '', '7+', function () { return new unaryOps.WebGLUnaryOp(operators_1.FLOAT_TYPES, unaryOps.glslSin()); }],
    ['Slice', '', '10+', function () { return new slice_1.WebGLSliceV10(); }],
    ['Slice', '', '1-9', function () { return new slice_1.WebGLSlice(); }],
    ['Softmax', '', '1+', function () { return new softmax_1.WebGLSoftmax(); }],
    // 'Split' operator has an optional attribute 'split'
    // this attribute determines how the specified axis of input data
    // is split. When the attribute is missing, we need the count of number of outputs
    // so that we can determine the 'split' attribute from the runtime input to the Operator
    ['Split', '', '2+', function (node) { return new split_1.WebGLSplit(node.outputs.length); }],
    ['Sqrt', '', '6+', function () { return new unaryOps.WebGLUnaryOp(operators_1.FLOAT_TYPES, unaryOps.glslSqrt()); }],
    ['Squeeze', '', '1+', function () { return new squeeze_1.WebGLSqueeze(); }],
    ['Sub', '', '7+', function () { return new binaryOps.WebGLBinaryOp(operators_1.NUMBER_TYPES, binaryOps.glslSub()); }],
    ['Sum', '', '6+', function () { return new sum_1.WebGLSum(); }],
    ['Tan', '', '7+', function () { return new unaryOps.WebGLUnaryOp(operators_1.FLOAT_TYPES, unaryOps.glslTan()); }],
    ['Tanh', '', '6+', function () { return new unaryOps.WebGLUnaryOp(operators_1.FLOAT_TYPES, unaryOps.glslTanh()); }],
    ['Tile', '', '6+', function () { return new tile_1.WebGLTile(); }],
    ['Transpose', '', '1+', function () { return new transpose_1.WebGLTranspose(); }],
    ['Upsample', '', '7-8', function () { return new upsample_1.WebGLUpsample(); }],
    ['Unsqueeze', '', '1+', function () { return new unsqueeze_1.WebGLUnsqueeze(); }],
    ['Xor', '', '7+', function () { return new binaryOps.WebGLBinaryOp(['bool'], binaryOps.glslXor()); }],
];
//# sourceMappingURL=op-resolve-rules.js.map