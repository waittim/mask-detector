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
exports.WasmBinaryOp = void 0;
var binary_op_1 = require("../../../ops/binary-op");
var tensor_1 = require("../../../tensor");
var util_1 = require("../../../util");
var wasm_binding_1 = require("../../../wasm-binding");
var WasmBinaryOp = /** @class */ (function (_super) {
    __extends(WasmBinaryOp, _super);
    function WasmBinaryOp(typeConstraint, opType, resultType) {
        return _super.call(this, typeConstraint, opType, resultType) || this;
    }
    WasmBinaryOp.prototype.run = function (inferenceHandler, inputs) {
        var outputShape = util_1.BroadcastUtil.calcShape(inputs[0].dims, inputs[1].dims, false);
        if (!outputShape) {
            throw new Error('not broadcastable');
        }
        var fun = '';
        // TODO: Explore better ways to deal with types than current `binaryOpType` approach
        var binaryOpType = '';
        switch (this.opType) {
            case 'Add':
                if (inputs[0].type === 'float32') {
                    fun = '_add_f32';
                    binaryOpType = 'float32InFloat32Out';
                }
                break;
            case 'Sub':
                if (inputs[0].type === 'float32') {
                    fun = '_sub_f32';
                    binaryOpType = 'float32InFloat32Out';
                }
                break;
            case 'Mul':
                if (inputs[0].type === 'float32') {
                    fun = '_mul_f32';
                    binaryOpType = 'float32InFloat32Out';
                }
                break;
            case 'Div':
                if (inputs[0].type === 'float32') {
                    fun = '_div_f32';
                    binaryOpType = 'float32InFloat32Out';
                }
                break;
            case 'PRelu':
                if (inputs[0].type === 'float32') {
                    fun = '_prelu_f32';
                    binaryOpType = 'float32InFloat32Out';
                }
                break;
            case 'Xor':
                fun = '_xor_u8';
                binaryOpType = 'boolInBoolOut';
                break;
            case 'Or':
                fun = '_or_u8';
                binaryOpType = 'boolInBoolOut';
                break;
            case 'And':
                fun = '_and_u8';
                binaryOpType = 'boolInBoolOut';
                break;
            default:
                throw Error("unsupported binary op by the Wasm backend");
        }
        var result;
        if (binaryOpType === 'float32InFloat32Out') {
            result = new tensor_1.Tensor(outputShape, 'float32');
            wasm_binding_1.WasmBinding.getInstance().ccall(fun, [inputs[0].floatData, 'float32ptr'], [inputs[0].dims.length, 'int32'], [inputs[0].dims, 'int32ptr'], [inputs[1].floatData, 'float32ptr'], [inputs[1].dims.length, 'int32'], [inputs[1].dims, 'int32ptr'], [result.floatData, 'float32ptr', 'out'], [result.floatData.length, 'int32'], [outputShape.length, 'int32'], [outputShape, 'int32ptr']);
        }
        else if (binaryOpType === 'boolInBoolOut') {
            result = new tensor_1.Tensor(outputShape, 'bool');
            wasm_binding_1.WasmBinding.getInstance().ccall(fun, [inputs[0].integerData, 'boolptr'], [inputs[0].dims.length, 'int32'], [inputs[0].dims, 'int32ptr'], [inputs[1].integerData, 'boolptr'], [inputs[1].dims.length, 'int32'], [inputs[1].dims, 'int32ptr'], [result.integerData, 'boolptr', 'out'], [result.integerData.length, 'int32'], [outputShape.length, 'int32'], [outputShape, 'int32ptr']);
        }
        else {
            throw new Error("Unsupported binary op format. Probably unsupported data types.");
        }
        return [result];
    };
    return WasmBinaryOp;
}(binary_op_1.BinaryOp));
exports.WasmBinaryOp = WasmBinaryOp;
//# sourceMappingURL=binary-op.js.map