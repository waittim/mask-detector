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
exports.flatten = exports.CpuFlatten = void 0;
var flatten_1 = require("../../../ops/flatten");
var tensor_1 = require("../../../tensor");
var util_1 = require("../../../util");
var CpuFlatten = /** @class */ (function (_super) {
    __extends(CpuFlatten, _super);
    function CpuFlatten() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuFlatten.prototype.run = function (inferenceHandler, inputs) {
        var output = flatten(inputs[0], this.axis);
        return [output];
    };
    return CpuFlatten;
}(flatten_1.Flatten));
exports.CpuFlatten = CpuFlatten;
function flatten(x, axis) {
    var outputDims = util_1.ShapeUtil.flattenShape(x.dims, axis);
    var output = new tensor_1.Tensor(outputDims, x.type);
    var X = x.numberData;
    var Y = output.numberData;
    Y.set(X);
    return output;
}
exports.flatten = flatten;
//# sourceMappingURL=flatten.js.map