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
exports.WasmSoftmax = void 0;
var softmax_1 = require("../../../ops/softmax");
var tensor_1 = require("../../../tensor");
var util_1 = require("../../../util");
var wasm_binding_1 = require("../../../wasm-binding");
var WasmSoftmax = /** @class */ (function (_super) {
    __extends(WasmSoftmax, _super);
    function WasmSoftmax() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WasmSoftmax.prototype.run = function (inferenceHandler, inputs) {
        var x = inputs[0];
        var axis = util_1.ShapeUtil.normalizeAxis(this.axis, x.dims.length);
        var N = util_1.ShapeUtil.sizeToDimension(x.dims, axis);
        var D = util_1.ShapeUtil.sizeFromDimension(x.dims, axis);
        var y = new tensor_1.Tensor(x.dims, x.type);
        wasm_binding_1.WasmBinding.getInstance().ccall('_softmax_f32', [x.floatData, 'float32ptr'], [y.floatData, 'float32ptr', 'out'], [N, 'int32'], [D, 'int32']);
        return [y];
    };
    // overriding the checkInputTypes() in the base class because Wasm backend has special type limitations
    WasmSoftmax.prototype.checkInputTypes = function (inputs) {
        // currently Wasm backend only supports 'float32' input type
        if (inputs[0].type !== 'float32') {
            return false;
        }
        return true;
    };
    return WasmSoftmax;
}(softmax_1.Softmax));
exports.WasmSoftmax = WasmSoftmax;
//# sourceMappingURL=softmax.js.map