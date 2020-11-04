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
exports.WasmClip = void 0;
var clip_1 = require("../../../ops/clip");
var tensor_1 = require("../../../tensor");
var wasm_binding_1 = require("../../../wasm-binding");
var WasmClip = /** @class */ (function (_super) {
    __extends(WasmClip, _super);
    function WasmClip() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WasmClip.prototype.run = function (inferenceHandler, inputs) {
        var result = new tensor_1.Tensor(inputs[0].dims, inputs[0].type);
        var size = result.floatData.length;
        if (inputs[0].type === 'float32') {
            wasm_binding_1.WasmBinding.getInstance().ccall('_clip_f32', [inputs[0].floatData, 'float32ptr'], [result.floatData, 'float32ptr', 'out'], [size, 'int32'], [this.min, 'float32'], [this.max, 'float32']);
        }
        // Expand for differnt types supported for this specific kernel of Clip
        else {
            throw new Error("Unsupported input type for Clip operator.");
        }
        return [result];
    };
    // overriding the checkInputTypes() in the base class because Wasm backend has special type limitations
    WasmClip.prototype.checkInputTypes = function (inputs) {
        // currently Wasm backend only supports 'float32' input type
        if (inputs[0].type !== 'float32') {
            return false;
        }
        return true;
    };
    return WasmClip;
}(clip_1.Clip));
exports.WasmClip = WasmClip;
//# sourceMappingURL=clip.js.map