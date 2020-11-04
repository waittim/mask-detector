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
exports.CpuBinaryOp = void 0;
var binary_op_1 = require("../../../ops/binary-op");
var util_1 = require("../../../util");
var CpuBinaryOp = /** @class */ (function (_super) {
    __extends(CpuBinaryOp, _super);
    function CpuBinaryOp(typeConstraint, opLambda, opType, resultType) {
        var _this = _super.call(this, typeConstraint, opType, resultType) || this;
        _this.opLambda = opLambda;
        return _this;
    }
    // overriding the initialize() in the base class
    CpuBinaryOp.prototype.initialize = function (attributes) {
        if (!this.opType && !this.opLambda) {
            throw new Error("Both opType and opLambda cannot be missing for a binary op");
        }
        // Expose functionality to construct opLambdas on the fly
        // This is not costly as initialize() should be invoked only once after the model is resolved to a graph object
        if (!this.opLambda) {
            switch (this.opType) {
                default:
                    throw new Error("Binary op could not be initialized. Missing op lambda.");
            }
        }
    };
    CpuBinaryOp.prototype.run = function (inferenceHandler, inputs) {
        var output = binaryOp(inputs[0], inputs[1], this.opLambda, false, this.resultType);
        return [output];
    };
    return CpuBinaryOp;
}(binary_op_1.BinaryOp));
exports.CpuBinaryOp = CpuBinaryOp;
function binaryOp(x, y, opLambda, inplace, resultType) {
    var result = util_1.BroadcastUtil.calc(x, y, opLambda, inplace, resultType);
    if (!result) {
        throw new Error('not broadcastable');
    }
    return result;
}
//# sourceMappingURL=binary-op.js.map