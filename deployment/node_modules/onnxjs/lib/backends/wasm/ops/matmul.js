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
exports.WasmMatMul = void 0;
var matmul_1 = require("../../../ops/matmul");
var tensor_1 = require("../../../tensor");
var util_1 = require("../../../util");
var wasm_binding_1 = require("../../../wasm-binding");
var WasmMatMul = /** @class */ (function (_super) {
    __extends(WasmMatMul, _super);
    function WasmMatMul() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WasmMatMul.prototype.run = function (inferenceHandler, inputs) {
        var _a = __read(util_1.MatMulUtil.preprocessInputShapes(inputs[0].dims, inputs[1].dims), 2), dimsA = _a[0], dimsB = _a[1];
        var outputShape = util_1.BroadcastUtil.calcShape(dimsA, dimsB, true);
        if (!outputShape) {
            // the inputs cannot broadcast or cannot multiply
            throw new Error("input dimensions do not match the requirement");
        }
        var outputSize = util_1.ShapeUtil.size(outputShape);
        var resultData = new Float32Array(outputSize);
        wasm_binding_1.WasmBinding.getInstance().ccall('_matmul_f32', [inputs[0].floatData, 'float32ptr'], [inputs[0].dims, 'int32ptr'], [inputs[0].dims.length, 'int32'], [inputs[1].floatData, 'float32ptr'], [inputs[1].dims, 'int32ptr'], [inputs[1].dims.length, 'int32'], [resultData, 'float32ptr', 'out'], [resultData.length, 'int32'], [outputShape, 'int32ptr'], [outputShape.length, 'int32']);
        util_1.MatMulUtil.postprocessOutputShape(outputShape, inputs[0].dims.length, inputs[1].dims.length);
        var result = new tensor_1.Tensor(outputShape, inputs[0].type);
        result.floatData.set(resultData);
        return [result];
    };
    // overriding the checkInputTypes() in the base class because Wasm backend has special type limitations
    WasmMatMul.prototype.checkInputTypes = function (inputs) {
        // currently Wasm backend only supports 'float32' input type
        if (inputs[0].type !== 'float32' || inputs[1].type !== 'float32') {
            return false;
        }
        if (inputs[0].type !== inputs[1].type) {
            return false;
        }
        return true;
    };
    return WasmMatMul;
}(matmul_1.MatMul));
exports.WasmMatMul = WasmMatMul;
//# sourceMappingURL=matmul.js.map