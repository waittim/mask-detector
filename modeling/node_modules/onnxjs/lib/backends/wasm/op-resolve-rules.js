"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.WASM_OP_RESOLVE_RULES = void 0;
var batch_normalization_1 = require("./ops/batch-normalization");
var binary_op_1 = require("./ops/binary-op");
var clip_1 = require("./ops/clip");
var conv_1 = require("./ops/conv");
var gemm_1 = require("./ops/gemm");
var instance_normalization_1 = require("./ops/instance-normalization");
var matmul_1 = require("./ops/matmul");
var pool_1 = require("./ops/pool");
var softmax_1 = require("./ops/softmax");
var sum_1 = require("./ops/sum");
exports.WASM_OP_RESOLVE_RULES = [
    ['Add', '', '7+', function () { return new binary_op_1.WasmBinaryOp(['float32'], 'Add'); }],
    ['And', '', '7+', function () { return new binary_op_1.WasmBinaryOp(['bool'], 'And'); }],
    ['AveragePool', '', '7-10', function () { return new pool_1.WasmAveragePool(); }],
    ['BatchNormalization', '', '7+', function () { return new batch_normalization_1.WasmBatchNormalization(); }],
    ['Clip', '', '6-10', function () { return new clip_1.WasmClip(); }],
    ['Conv', '', '1+', function () { return new conv_1.WasmConv(); }],
    ['Div', '', '7+', function () { return new binary_op_1.WasmBinaryOp(['float32'], 'Div'); }],
    ['Gemm', '', '7-10', function () { return new gemm_1.WasmGemm(false); }],
    ['Gemm', '', '11+', function () { return new gemm_1.WasmGemm(true); }],
    ['GlobalAveragePool', '', '1+', function () { return new pool_1.WasmGlobalAveragePool(); }],
    ['GlobalMaxPool', '', '1+', function () { return new pool_1.WasmGlobalMaxPool(); }],
    ['InstanceNormalization', '', '6+', function () { return new instance_normalization_1.WasmInstanceNormalization(); }],
    ['MatMul', '', '1+', function () { return new matmul_1.WasmMatMul(); }],
    ['MaxPool', '', '1-9', function () { return new pool_1.WasmMaxPool(); }],
    ['Mul', '', '7+', function () { return new binary_op_1.WasmBinaryOp(['float32'], 'Mul'); }],
    ['Or', '', '7+', function () { return new binary_op_1.WasmBinaryOp(['bool'], 'Or'); }],
    ['PRelu', '', '7+', function () { return new binary_op_1.WasmBinaryOp(['float32'], 'PRelu'); }],
    ['Softmax', '', '1+', function () { return new softmax_1.WasmSoftmax(); }],
    ['Sub', '', '7+', function () { return new binary_op_1.WasmBinaryOp(['float32'], 'Sub'); }],
    ['Sum', '', '6+', function () { return new sum_1.WasmSum(); }],
    ['Xor', '', '7+', function () { return new binary_op_1.WasmBinaryOp(['bool'], 'Xor'); }],
];
//# sourceMappingURL=op-resolve-rules.js.map