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
exports.dropout = exports.CpuDropout = void 0;
var dropout_1 = require("../../../ops/dropout");
var tensor_1 = require("../../../tensor");
var CpuDropout = /** @class */ (function (_super) {
    __extends(CpuDropout, _super);
    function CpuDropout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuDropout.prototype.run = function (inferenceHandler, inputs) {
        var output = dropout(inputs[0], this.ratio, this.testMode);
        return [output];
    };
    return CpuDropout;
}(dropout_1.Dropout));
exports.CpuDropout = CpuDropout;
function dropout(x, ratio, isTestMode) {
    if (!isTestMode) {
        throw new Error('only test mode is supported');
    }
    var output = new tensor_1.Tensor(x.dims, x.type);
    var X = x.floatData;
    var Y = output.numberData;
    Y.set(X);
    return output;
}
exports.dropout = dropout;
//# sourceMappingURL=dropout.js.map