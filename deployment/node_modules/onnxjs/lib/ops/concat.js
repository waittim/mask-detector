"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Concat = void 0;
var Concat = /** @class */ (function () {
    function Concat() {
    }
    Concat.prototype.initialize = function (attributes) {
        this.axis = attributes.getInt('axis');
    };
    Concat.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length < 1) {
            return false;
        }
        return this.checkInputTypes(inputs);
    };
    Concat.prototype.checkInputTypes = function (inputs) {
        var e_1, _a;
        var inputType = inputs[0].type;
        var inputDimensionality = inputs[0].dims.length;
        // TODO: Support string concat
        if (inputType === 'string') {
            return false;
        }
        try {
            for (var inputs_1 = __values(inputs), inputs_1_1 = inputs_1.next(); !inputs_1_1.done; inputs_1_1 = inputs_1.next()) {
                var input = inputs_1_1.value;
                // make sure types of all inputs match
                if (input.type !== inputType) {
                    return false;
                }
                // make sure the dimensionality of all inputs are the same
                if (input.dims.length !== inputDimensionality) {
                    return false;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (inputs_1_1 && !inputs_1_1.done && (_a = inputs_1.return)) _a.call(inputs_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return true;
    };
    return Concat;
}());
exports.Concat = Concat;
//# sourceMappingURL=concat.js.map