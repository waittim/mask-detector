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
exports.sum = exports.CpuSum = void 0;
var sum_1 = require("../../../ops/sum");
var tensor_1 = require("../../../tensor");
var CpuSum = /** @class */ (function (_super) {
    __extends(CpuSum, _super);
    function CpuSum() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuSum.prototype.run = function (inferenceHandler, inputs) {
        var output = sum(inputs);
        return [output];
    };
    return CpuSum;
}(sum_1.Sum));
exports.CpuSum = CpuSum;
function sum(x) {
    var output = new tensor_1.Tensor(x[0].dims, x[0].type);
    var size = x[0].floatData.length;
    var Y = output.floatData;
    for (var i = 0; i < x.length; i++) {
        var arr = x[i].floatData;
        for (var j = 0; j < size; ++j) {
            Y[j] += arr[j];
        }
    }
    return output;
}
exports.sum = sum;
//# sourceMappingURL=sum.js.map