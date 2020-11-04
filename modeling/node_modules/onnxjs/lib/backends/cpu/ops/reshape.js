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
exports.reshape = exports.CpuReshape = void 0;
var reshape_1 = require("../../../ops/reshape");
var tensor_1 = require("../../../tensor");
var util_1 = require("../../../util");
var CpuReshape = /** @class */ (function (_super) {
    __extends(CpuReshape, _super);
    function CpuReshape() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuReshape.prototype.run = function (inferenceHandler, inputs) {
        var output = reshape(inputs[0], inputs[1]);
        return [output];
    };
    return CpuReshape;
}(reshape_1.Reshape));
exports.CpuReshape = CpuReshape;
function reshape(x, shape) {
    var reshapedDims = util_1.ShapeUtil.calculateReshapedDims(x.dims, shape.integerData);
    var output = new tensor_1.Tensor(reshapedDims, x.type);
    var Y = output.floatData;
    Y.set(x.floatData);
    return output;
}
exports.reshape = reshape;
//# sourceMappingURL=reshape.js.map