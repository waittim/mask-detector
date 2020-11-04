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
exports.gemm = exports.CpuGemm = void 0;
var gemm_1 = require("../../../ops/gemm");
var tensor_1 = require("../../../tensor");
var util = __importStar(require("../../../util"));
var matmul_1 = require("./matmul");
var CpuGemm = /** @class */ (function (_super) {
    __extends(CpuGemm, _super);
    function CpuGemm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuGemm.prototype.run = function (inferenceHandler, inputs) {
        var output = gemm(inputs[0], inputs[1], this.alpha, this.beta, this.transA, this.transB, inputs.length === 3 ? inputs[2] : undefined);
        return [output];
    };
    return CpuGemm;
}(gemm_1.Gemm));
exports.CpuGemm = CpuGemm;
function gemm(a, b, alpha, beta, transA, transB, c) {
    var _a = __read(util.GemmUtil.getShapeOfGemmResult(a.dims, transA, b.dims, transB, c === null || c === void 0 ? void 0 : c.dims), 3), M = _a[0], N = _a[1], K = _a[2];
    // The result will always be of the shape [M,N]
    var output = new tensor_1.Tensor([M, N], a.type);
    // broadcast and assign value from C to output
    if (c && util.BroadcastUtil.calc(output, c, function (a, b) { return b; }, true) !== output) {
        throw new Error("tensor C is not broadcastable to [M,N]");
    }
    matmul_1.matMul2d(a.floatData, b.floatData, output.floatData, transA, transB, alpha, beta, M, N, K);
    return output;
}
exports.gemm = gemm;
//# sourceMappingURL=gemm.js.map