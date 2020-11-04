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
exports.matMul2d = exports.matMul = exports.CpuMatMul = void 0;
var matmul_1 = require("../../../ops/matmul");
var tensor_1 = require("../../../tensor");
var util_1 = require("../../../util");
var CpuMatMul = /** @class */ (function (_super) {
    __extends(CpuMatMul, _super);
    function CpuMatMul() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuMatMul.prototype.run = function (inferenceHandler, inputs) {
        var output = matMul(inputs[0], inputs[1]);
        return [output];
    };
    return CpuMatMul;
}(matmul_1.MatMul));
exports.CpuMatMul = CpuMatMul;
function matMul(a, b) {
    var _a = __read(util_1.MatMulUtil.preprocessInputShapes(a.dims, b.dims), 2), dimsA = _a[0], dimsB = _a[1];
    var mat2dShape = [dimsA[dimsA.length - 2], dimsB[dimsB.length - 1]];
    var shape = util_1.BroadcastUtil.calcShape(dimsA, dimsB, true);
    if (!shape) {
        // the inputs cannot broadcast or cannot multiply
        throw new Error("input dimensions do not match the requirement");
    }
    var size = util_1.ShapeUtil.size(shape);
    var num2dMatrices = size / (mat2dShape[0] * mat2dShape[1]);
    var y = new tensor_1.Tensor(shape, a.type === 'float64' || b.type === 'float64' ? 'float64' : 'float32');
    var offsetY = 0;
    var indices = new Array(shape.length);
    var indicesA = new Array(a.dims.length);
    var indicesB = new Array(b.dims.length);
    for (var i = 0; i < num2dMatrices; i++) {
        // traverse nd array at 2d level
        indices[shape.length - 2] = 0;
        indices[shape.length - 1] = 0;
        var rest = i;
        for (var j = shape.length - 3; j >= 0; j--) {
            indices[j] = rest % shape[j];
            rest = Math.floor(rest / shape[j]);
        }
        // map the "broadcasted" index to original index
        util_1.BroadcastUtil.fillIndex(indices, a.dims, indicesA);
        util_1.BroadcastUtil.fillIndex(indices, b.dims, indicesB);
        // calculate subarrays offset for A and B
        var offsetA = indicesA.length <= 2 ? 0 : util_1.ShapeUtil.indicesToOffset(indicesA, a.strides, shape.length - 2);
        var offsetB = indicesB.length <= 2 ? 0 : util_1.ShapeUtil.indicesToOffset(indicesB, b.strides, shape.length - 2);
        // multiply like conventional matrices
        matMul2d(a.floatData.subarray(offsetA), b.floatData.subarray(offsetB), y.floatData.subarray(offsetY), false, false, 1, 0, mat2dShape[0], mat2dShape[1], dimsA[dimsA.length - 1]);
        offsetY += mat2dShape[0] * mat2dShape[1];
    }
    return y;
}
exports.matMul = matMul;
/**
 * perform matrix multiply on C = alpha * A * B + beta * C
 * @param A data of tensor A, whose shape is [M,K] or [K,M] (if transA)
 * @param B data of tensor B, whose shape is [K,N] or [N,K] (if transB)
 * @param C data of tensor C, whose shape is [M,N]
 */
function matMul2d(A, B, C, transA, transB, alpha, beta, M, N, K) {
    if (transA && transB) {
        return matMul2d_tAtB(A, B, C, alpha, beta, M, N, K);
    }
    else if (transA) {
        return matMul2d_tA(A, B, C, alpha, beta, M, N, K);
    }
    else if (transB) {
        return matMul2d_tB(A, B, C, alpha, beta, M, N, K);
    }
    else {
        return matMul2d_(A, B, C, alpha, beta, M, N, K);
    }
}
exports.matMul2d = matMul2d;
function matMul2d_(A, B, C, alpha, beta, M, N, K) {
    var offsetA = 0, offsetB = 0, offsetC = 0;
    for (var mm = 0; mm < M; mm++) {
        for (var nn = 0; nn < N; nn++) {
            var sum = 0;
            for (var kk = 0; kk < K; kk++) {
                sum += A[offsetA] * B[offsetB];
                offsetA += 1;
                offsetB += N;
            }
            offsetA -= K;
            offsetB -= N * K;
            C[offsetC] = alpha * sum + beta * C[offsetC];
            offsetC++;
            offsetB++;
        }
        offsetB -= N;
        offsetA += K;
    }
}
function matMul2d_tA(A, B, C, alpha, beta, M, N, K) {
    var offsetA = 0, offsetB = 0, offsetC = 0;
    for (var mm = 0; mm < M; mm++) {
        for (var nn = 0; nn < N; nn++) {
            var sum = 0;
            for (var kk = 0; kk < K; kk++) {
                sum += A[offsetA] * B[offsetB];
                offsetA += M;
                offsetB += N;
            }
            offsetA -= M * K;
            offsetB -= N * K;
            C[offsetC] = alpha * sum + beta * C[offsetC];
            offsetC++;
            offsetB++;
        }
        offsetB -= N;
        offsetA++;
    }
}
function matMul2d_tB(A, B, C, alpha, beta, M, N, K) {
    var offsetA = 0, offsetB = 0, offsetC = 0;
    for (var mm = 0; mm < M; mm++) {
        for (var nn = 0; nn < N; nn++) {
            var sum = 0;
            for (var kk = 0; kk < K; kk++) {
                sum += A[offsetA] * B[offsetB];
                offsetA += 1;
                offsetB += 1;
            }
            offsetA -= K;
            offsetB -= K;
            C[offsetC] = alpha * sum + beta * C[offsetC];
            offsetC++;
            offsetB += K;
        }
        offsetB -= N * K;
        offsetA += K;
    }
}
function matMul2d_tAtB(A, B, C, alpha, beta, M, N, K) {
    var offsetA = 0, offsetB = 0, offsetC = 0;
    for (var mm = 0; mm < M; mm++) {
        for (var nn = 0; nn < N; nn++) {
            var sum = 0;
            for (var kk = 0; kk < K; kk++) {
                sum += A[offsetA] * B[offsetB];
                offsetA += M;
                offsetB += 1;
            }
            offsetA -= M * K;
            offsetB -= K;
            C[offsetC] = alpha * sum + beta * C[offsetC];
            offsetC++;
            offsetB += K;
        }
        offsetB -= N * K;
        offsetA++;
    }
}
//# sourceMappingURL=matmul.js.map