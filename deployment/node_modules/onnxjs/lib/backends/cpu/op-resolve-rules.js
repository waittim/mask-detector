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
exports.CPU_OP_RESOLVE_RULES = void 0;
var operators_1 = require("../../operators");
var argMax_1 = require("./ops/argMax");
var batch_normalization_1 = require("./ops/batch-normalization");
var binary_op_1 = require("./ops/binary-op");
var concat_1 = require("./ops/concat");
var conv_1 = require("./ops/conv");
var dropout_1 = require("./ops/dropout");
var flatten_1 = require("./ops/flatten");
var gather_1 = require("./ops/gather");
var gemm_1 = require("./ops/gemm");
var image_scaler_1 = require("./ops/image-scaler");
var instance_normalization_1 = require("./ops/instance-normalization");
var lrn_1 = require("./ops/lrn");
var matmul_1 = require("./ops/matmul");
var pad_1 = require("./ops/pad");
var pool_1 = require("./ops/pool");
var cpuReduce = __importStar(require("./ops/reduce"));
var reshape_1 = require("./ops/reshape");
var slice_1 = require("./ops/slice");
var softmax_1 = require("./ops/softmax");
var squeeze_1 = require("./ops/squeeze");
var sum_1 = require("./ops/sum");
var tile_1 = require("./ops/tile");
var transpose_1 = require("./ops/transpose");
var unaryOps = __importStar(require("./ops/unary-op"));
var unary_op_1 = require("./ops/unary-op");
var unsqueeze_1 = require("./ops/unsqueeze");
var upsample_1 = require("./ops/upsample");
exports.CPU_OP_RESOLVE_RULES = [
    ['Abs', '', '6+', function () { return new unary_op_1.CpuUnaryOp(operators_1.NUMBER_TYPES, unaryOps.abs); }],
    ['Acos', '', '7+', function () { return new unary_op_1.CpuUnaryOp(operators_1.FLOAT_TYPES, unaryOps.acos); }],
    ['Acosh', '', '9+', function () { return new unary_op_1.CpuUnaryOp(operators_1.FLOAT_TYPES, unaryOps.acosh); }],
    ['Add', '', '7+', function () { return new binary_op_1.CpuBinaryOp(operators_1.NUMBER_TYPES, function (e1, e2) { return (e1 + e2); }); }],
    ['And', '', '7+', function () { return new binary_op_1.CpuBinaryOp(['bool'], function (e1, e2) { return (e1 && e2); }); }],
    ['ArgMax', '', '1-11', function () { return new argMax_1.CpuArgMax(); }],
    ['Asin', '', '7+', function () { return new unary_op_1.CpuUnaryOp(operators_1.FLOAT_TYPES, unaryOps.asin); }],
    ['Asinh', '', '9+', function () { return new unary_op_1.CpuUnaryOp(operators_1.FLOAT_TYPES, unaryOps.asinh); }],
    ['Atan', '', '7+', function () { return new unary_op_1.CpuUnaryOp(operators_1.FLOAT_TYPES, unaryOps.atan); }],
    ['Atanh', '', '9+', function () { return new unary_op_1.CpuUnaryOp(operators_1.FLOAT_TYPES, unaryOps.atanh); }],
    ['AveragePool', '', '7-10', function () { return new pool_1.CpuAveragePool(); }],
    ['BatchNormalization', '', '7+', function () { return new batch_normalization_1.CpuBatchNormalization(); }],
    ['Ceil', '', '6+', function () { return new unary_op_1.CpuUnaryOp(operators_1.FLOAT_TYPES, unaryOps.ceil); }],
    ['Clip', '', '6-10', function () { return new unary_op_1.CpuUnaryOp(operators_1.FLOAT_TYPES, unaryOps.clip, unaryOps.clipInitializer); }],
    ['Concat', '', '4+', function () { return new concat_1.CpuConcat(); }],
    ['Conv', '', '1+', function () { return new conv_1.CpuConv(); }],
    ['Cos', '', '7+', function () { return new unary_op_1.CpuUnaryOp(operators_1.FLOAT_TYPES, unaryOps.cos); }],
    ['Cosh', '', '9+', function () { return new unary_op_1.CpuUnaryOp(operators_1.FLOAT_TYPES, unaryOps.cosh); }],
    ['Div', '', '7+', function () { return new binary_op_1.CpuBinaryOp(operators_1.NUMBER_TYPES, function (e1, e2) { return (e1 / e2); }); }],
    ['Dropout', '', '7+', function () { return new dropout_1.CpuDropout(); }],
    ['Elu', '', '6+', function () { return new unary_op_1.CpuUnaryOp(operators_1.FLOAT_TYPES, unaryOps.elu, unaryOps.eluInitializer); }],
    ['Exp', '', '6+', function () { return new unary_op_1.CpuUnaryOp(operators_1.FLOAT_TYPES, unaryOps.exp); }],
    ['Flatten', '', '1+', function () { return new flatten_1.CpuFlatten(); }],
    ['Floor', '', '6+', function () { return new unary_op_1.CpuUnaryOp(operators_1.FLOAT_TYPES, unaryOps.floor); }],
    ['Gather', '', '1+', function () { return new gather_1.CpuGather(); }],
    ['Gemm', '', '7-10', function () { return new gemm_1.CpuGemm(false); }],
    ['Gemm', '', '11+', function () { return new gemm_1.CpuGemm(true); }],
    ['GlobalAveragePool', '', '1+', function () { return new pool_1.CpuGlobalAveragePool(); }],
    ['GlobalMaxPool', '', '1+', function () { return new pool_1.CpuGlobalMaxPool(); }],
    ['ImageScaler', '', '1+', function () { return new image_scaler_1.CpuImageScaler(); }],
    ['InstanceNormalization', '', '6+', function () { return new instance_normalization_1.CpuInstanceNormalization(); }],
    ['IsNaN', '', '9+', function () { return new unary_op_1.CpuUnaryOp(operators_1.FLOAT_TYPES, unaryOps.isNan, undefined, 'bool'); }],
    ['LeakyRelu', '', '6+', function () { return new unary_op_1.CpuUnaryOp(operators_1.FLOAT_TYPES, unaryOps.leakyRelu, unaryOps.leakyReluInitializer); }],
    ['Log', '', '6+', function () { return new unary_op_1.CpuUnaryOp(operators_1.FLOAT_TYPES, unaryOps.log); }],
    ['LRN', '', '1+', function () { return new lrn_1.CpuLrn(); }],
    ['MatMul', '', '1+', function () { return new matmul_1.CpuMatMul(); }],
    ['MaxPool', '', '1-9', function () { return new pool_1.CpuMaxPool(); }],
    ['Mul', '', '7+', function () { return new binary_op_1.CpuBinaryOp(operators_1.NUMBER_TYPES, function (e1, e2) { return (e1 * e2); }); }],
    ['Neg', '', '6+', function () { return new unary_op_1.CpuUnaryOp(operators_1.NUMBER_TYPES, unaryOps.neg); }],
    ['Not', '', '1+', function () { return new unary_op_1.CpuUnaryOp(['bool'], unaryOps.not, undefined, 'bool'); }],
    ['Or', '', '7+', function () { return new binary_op_1.CpuBinaryOp(['bool'], function (e1, e2) { return (e1 || e2); }); }],
    ['PRelu', '', '7+', function () { return new binary_op_1.CpuBinaryOp(operators_1.NUMBER_TYPES, function (e1, e2) { return (e1 >= 0 ? e1 : e1 * e2); }); }],
    ['Pad', '', '2-10', function () { return new pad_1.CpuPad(); }],
    ['Reciprocal', '', '6+', function () { return new unary_op_1.CpuUnaryOp(operators_1.FLOAT_TYPES, unaryOps.reciprocal); }],
    ['ReduceLogSum', '', '1+', function () { return new cpuReduce.CpuReduceLogSum(); }],
    ['ReduceMax', '', '1+', function () { return new cpuReduce.CpuReduceMax(); }],
    ['ReduceMean', '', '1+', function () { return new cpuReduce.CpuReduceMean(); }],
    ['ReduceMin', '', '1+', function () { return new cpuReduce.CpuReduceMin(); }],
    ['ReduceProd', '', '1+', function () { return new cpuReduce.CpuReduceProd(); }],
    ['ReduceSum', '', '1+', function () { return new cpuReduce.CpuReduceSum(); }],
    ['ReduceSumSquare', '', '1+', function () { return new cpuReduce.CpuReduceSumSquare(); }],
    ['Relu', '', '6+', function () { return new unary_op_1.CpuUnaryOp(operators_1.FLOAT_TYPES, unaryOps.relu); }],
    ['Reshape', '', '5+', function () { return new reshape_1.CpuReshape(); }],
    ['Sigmoid', '', '6+', function () { return new unary_op_1.CpuUnaryOp(operators_1.FLOAT_TYPES, unaryOps.sigmoid); }],
    ['Sign', '', '9+', function () { return new unary_op_1.CpuUnaryOp(operators_1.NUMBER_TYPES, unaryOps.sign); }],
    ['Sin', '', '7+', function () { return new unary_op_1.CpuUnaryOp(operators_1.FLOAT_TYPES, unaryOps.sin); }],
    ['Sinh', '', '9+', function () { return new unary_op_1.CpuUnaryOp(operators_1.FLOAT_TYPES, unaryOps.sinh); }],
    ['Slice', '', '10+', function () { return new slice_1.CpuSliceV10(); }],
    ['Slice', '', '1-9', function () { return new slice_1.CpuSlice(); }],
    ['Softmax', '', '1+', function () { return new softmax_1.CpuSoftmax(); }],
    ['Sqrt', '', '6+', function () { return new unary_op_1.CpuUnaryOp(operators_1.FLOAT_TYPES, unaryOps.sqrt); }],
    ['Squeeze', '', '1+', function () { return new squeeze_1.CpuSqueeze(); }],
    ['Sub', '', '7+', function () { return new binary_op_1.CpuBinaryOp(operators_1.NUMBER_TYPES, function (e1, e2) { return (e1 - e2); }); }],
    ['Sum', '', '6+', function () { return new sum_1.CpuSum(); }],
    ['Tan', '', '7+', function () { return new unary_op_1.CpuUnaryOp(operators_1.FLOAT_TYPES, unaryOps.tan); }],
    ['Tanh', '', '6+', function () { return new unary_op_1.CpuUnaryOp(operators_1.FLOAT_TYPES, unaryOps.tanh); }],
    ['Tile', '', '6+', function () { return new tile_1.CpuTile(); }],
    ['Transpose', '', '1+', function () { return new transpose_1.CpuTranspose(); }],
    ['Unsqueeze', '', '1+', function () { return new unsqueeze_1.CpuUnsqueeze(); }],
    ['Upsample', '', '7-8', function () { return new upsample_1.CpuUpsample(); }],
    ['Xor', '', '7+', function () { return new binary_op_1.CpuBinaryOp(['bool'], function (e1, e2) { return (e1 ^ e2); }); }],
];
//# sourceMappingURL=op-resolve-rules.js.map