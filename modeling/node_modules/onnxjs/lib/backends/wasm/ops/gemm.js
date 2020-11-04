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
exports.WasmGemm = void 0;
var gemm_1 = require("../../../ops/gemm");
var tensor_1 = require("../../../tensor");
var util_1 = require("../../../util");
var wasm_binding_1 = require("../../../wasm-binding");
var WasmGemm = /** @class */ (function (_super) {
    __extends(WasmGemm, _super);
    function WasmGemm() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WasmGemm.prototype.run = function (inferenceHandler, inputs) {
        var a = inputs[0];
        var b = inputs[1];
        var c = inputs[2];
        var _a = __read(util_1.GemmUtil.getShapeOfGemmResult(a.dims, this.transA, b.dims, this.transB, c === null || c === void 0 ? void 0 : c.dims), 2), M = _a[0], N = _a[1];
        var y = new tensor_1.Tensor([M, N], a.type);
        if (c && !util_1.BroadcastUtil.calc(y, c, function (a, b) { return (b); }, true)) {
            throw new Error("c is not broadcastable to the shape of the result of the Gemm operator");
        }
        wasm_binding_1.WasmBinding.getInstance().ccall('_gemm_f32', [this.transA, 'bool'], [this.transB, 'bool'], [this.transA ? a.dims[1] : a.dims[0], 'int32'], [this.transB ? b.dims[0] : b.dims[1], 'int32'], [this.transA ? a.dims[0] : a.dims[1], 'int32'], [this.alpha, 'float32'], [a.floatData, 'float32ptr'], [b.floatData, 'float32ptr'], [this.beta, 'float32'], [y.floatData, 'float32ptr', 'inout']);
        return [y];
    };
    // overriding the checkInputTypes() in the base class because Wasm backend has special type limitations
    WasmGemm.prototype.checkInputTypes = function (inputs) {
        // currently Wasm backend only supports 'float32' input type
        if (inputs[0].type !== 'float32' || inputs[1].type !== 'float32' || inputs[2].type !== 'float32') {
            return false;
        }
        if ((inputs[0].type !== inputs[1].type) || (inputs[0].type !== inputs[2].type)) {
            return false;
        }
        return true;
    };
    return WasmGemm;
}(gemm_1.Gemm));
exports.WasmGemm = WasmGemm;
//# sourceMappingURL=gemm.js.map