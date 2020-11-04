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
exports.WasmInstanceNormalization = void 0;
var instance_normalization_1 = require("../../../ops/instance-normalization");
var tensor_1 = require("../../../tensor");
var wasm_binding_1 = require("../../../wasm-binding");
var WasmInstanceNormalization = /** @class */ (function (_super) {
    __extends(WasmInstanceNormalization, _super);
    function WasmInstanceNormalization() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WasmInstanceNormalization.prototype.run = function (inferenceHandler, inputs) {
        var x = inputs[0];
        var scale = inputs[1];
        var b = inputs[2];
        // calculate channel size (i.e.) data points per channel
        var channelSize = 1;
        for (var i = 2; i < x.dims.length; i++) {
            channelSize *= x.dims[i];
        }
        // create output Tensor after determining output size
        var y = new tensor_1.Tensor(x.dims, x.type);
        wasm_binding_1.WasmBinding.getInstance().ccall('_instance_normalization_f32', [x.floatData, 'float32ptr'], [y.floatData, 'float32ptr', 'out'], [x.dims[0], 'int32'], [x.dims[1], 'int32'], [channelSize, 'int32'], [scale.floatData, 'float32ptr'], [b.floatData, 'float32ptr'], [this.epsilon, 'float32']);
        return [y];
    };
    // overriding the checkInputTypes() in the base class because Wasm backend has special type limitations
    WasmInstanceNormalization.prototype.checkInputTypes = function (inputs) {
        var X = inputs[0];
        var scale = inputs[1];
        var B = inputs[2];
        // input should atleast have three dimensions - N,C,dim1,...,dimn
        // other inputs need to be one dimensional
        if (X.dims.length < 3 || scale.dims.length !== 1 || B.dims.length !== 1) {
            return false;
        }
        if (scale.dims[0] !== X.dims[1] || B.dims[0] !== X.dims[1]) {
            return false;
        }
        // currently Wasm backend only supports 'float32' input type
        if (X.type !== 'float32' || scale.type !== 'float32' || B.type !== 'float32') {
            return false;
        }
        return true;
    };
    return WasmInstanceNormalization;
}(instance_normalization_1.InstanceNormalization));
exports.WasmInstanceNormalization = WasmInstanceNormalization;
//# sourceMappingURL=instance-normalization.js.map