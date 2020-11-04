"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnaryOp = void 0;
var UnaryOp = /** @class */ (function () {
    function UnaryOp(typeConstraint, resultType) {
        this.typeConstraint = typeConstraint;
        this.resultType = resultType;
    }
    UnaryOp.prototype.initialize = function (attributes) { };
    UnaryOp.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length !== 1) {
            return false;
        }
        return this.checkInputTypes(inputs);
    };
    UnaryOp.prototype.checkInputTypes = function (inputs) {
        if (this.typeConstraint.indexOf(inputs[0].type) === -1) {
            return false;
        }
        return true;
    };
    return UnaryOp;
}());
exports.UnaryOp = UnaryOp;
//# sourceMappingURL=unary-op.js.map