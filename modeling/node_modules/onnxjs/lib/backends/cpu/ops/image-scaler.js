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
exports.imageScaler = exports.CpuImageScaler = void 0;
var image_scaler_1 = require("../../../ops/image-scaler");
var tensor_1 = require("../../../tensor");
var CpuImageScaler = /** @class */ (function (_super) {
    __extends(CpuImageScaler, _super);
    function CpuImageScaler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuImageScaler.prototype.run = function (inferenceHandler, inputs) {
        var output = imageScaler(inputs[0], this.bias, this.scale);
        return [output];
    };
    return CpuImageScaler;
}(image_scaler_1.ImageScaler));
exports.CpuImageScaler = CpuImageScaler;
function imageScaler(x, bias, scale) {
    var _a = __read(x.dims, 4), N = _a[0], C = _a[1], H = _a[2], W = _a[3];
    var output = new tensor_1.Tensor([N, C, H, W], x.type);
    var X = x.floatData;
    var Y = output.floatData;
    for (var nc = 0; nc < N * C; nc++) {
        for (var hw = 0; hw < H * W; hw++) {
            var index = nc * H * W + hw;
            Y[index] = X[index] * scale + bias[nc % C];
        }
    }
    return output;
}
exports.imageScaler = imageScaler;
//# sourceMappingURL=image-scaler.js.map