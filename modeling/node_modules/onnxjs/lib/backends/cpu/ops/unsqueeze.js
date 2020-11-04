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
exports.unsqueeze = exports.CpuUnsqueeze = void 0;
var unsqueeze_1 = require("../../../ops/unsqueeze");
var tensor_1 = require("../../../tensor");
var util_1 = require("../../../util");
var CpuUnsqueeze = /** @class */ (function (_super) {
    __extends(CpuUnsqueeze, _super);
    function CpuUnsqueeze() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuUnsqueeze.prototype.run = function (inferenceHandler, inputs) {
        var output = unsqueeze(inputs[0], this.axes);
        return [output];
    };
    return CpuUnsqueeze;
}(unsqueeze_1.Unsqueeze));
exports.CpuUnsqueeze = CpuUnsqueeze;
function unsqueeze(x, axes) {
    var outputDims = util_1.ShapeUtil.unsqueezeShape(x.dims, axes);
    var output = new tensor_1.Tensor(outputDims, x.type);
    var X = x.numberData;
    var Y = output.numberData;
    Y.set(X);
    return output;
}
exports.unsqueeze = unsqueeze;
//# sourceMappingURL=unsqueeze.js.map