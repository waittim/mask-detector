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
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WasmSum = void 0;
var sum_1 = require("../../../ops/sum");
var tensor_1 = require("../../../tensor");
var wasm_binding_1 = require("../../../wasm-binding");
var WasmSum = /** @class */ (function (_super) {
    __extends(WasmSum, _super);
    function WasmSum() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WasmSum.prototype.run = function (inferenceHandler, inputs) {
        var _a;
        var y = new tensor_1.Tensor(inputs[0].dims, inputs[0].type);
        var size = inputs[0].floatData.length;
        var input = new Array(inputs.length);
        for (var i = 0; i < inputs.length; i++) {
            input[i] = [inputs[i].floatData, 'float32ptr'];
        }
        (_a = wasm_binding_1.WasmBinding.getInstance()).ccall.apply(_a, __spread(['_sum_f32', [inputs.length, 'int32'], [size, 'int32'], [y.floatData, 'float32ptr', 'inout']], input));
        return [y];
    };
    // overriding the checkInputTypes() in the base class because Wasm backend has special type limitations
    WasmSum.prototype.checkInputTypes = function (inputs) {
        // currently Wasm backend only supports 'float32' input type
        if (inputs[0].type !== 'float32') {
            return false;
        }
        for (var i = 1; i < inputs.length; i++) {
            if (inputs[0].type !== inputs[i].type) {
                return false;
            }
        }
        return true;
    };
    return WasmSum;
}(sum_1.Sum));
exports.WasmSum = WasmSum;
//# sourceMappingURL=sum.js.map