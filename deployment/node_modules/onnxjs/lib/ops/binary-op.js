"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.BinaryOp = void 0;
var BinaryOp = /** @class */ (function () {
    function BinaryOp(typeConstraint, opType, resultType) {
        this.typeConstraint = typeConstraint;
        this.opType = opType;
        this.resultType = resultType;
    }
    BinaryOp.prototype.initialize = function (attributes) { };
    BinaryOp.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length !== 2) {
            return false;
        }
        return this.checkInputTypes(inputs);
    };
    BinaryOp.prototype.checkInputTypes = function (inputs) {
        if (this.typeConstraint.indexOf(inputs[0].type) === -1) {
            return false;
        }
        if (inputs[0].type !== inputs[1].type) {
            return false;
        }
        return true;
    };
    return BinaryOp;
}());
exports.BinaryOp = BinaryOp;
//# sourceMappingURL=binary-op.js.map