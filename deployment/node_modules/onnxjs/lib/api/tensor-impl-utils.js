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
exports.validateIndices = exports.matchElementType = exports.toInternalTensor = exports.fromInternalTensor = void 0;
var tensor_1 = require("../tensor");
var tensor_impl_1 = require("./tensor-impl");
function fromInternalTensor(internalTensor) {
    switch (internalTensor.type) {
        case 'bool':
            return new tensor_impl_1.Tensor(new Uint8Array(internalTensor.integerData), 'bool', internalTensor.dims);
        case 'float32':
            return new tensor_impl_1.Tensor(internalTensor.floatData, 'float32', internalTensor.dims);
        case 'float64':
            return new tensor_impl_1.Tensor(new Float32Array(internalTensor.floatData), 'float32', internalTensor.dims);
        case 'string':
            return new tensor_impl_1.Tensor(internalTensor.stringData, 'string', internalTensor.dims);
        case 'int8' || 'uint8' || 'int16' || 'uint16' || 'uint32':
            return new tensor_impl_1.Tensor(new Int32Array(internalTensor.integerData), 'int32', internalTensor.dims);
        case 'int32':
            return new tensor_impl_1.Tensor(internalTensor.integerData, 'int32', internalTensor.dims);
        default:
            throw new TypeError('Tensor type is not supported. ');
    }
}
exports.fromInternalTensor = fromInternalTensor;
function toInternalTensor(tensor) {
    return new tensor_1.Tensor(tensor.dims, tensor.type, undefined, undefined, tensor.data);
}
exports.toInternalTensor = toInternalTensor;
function matchElementType(type, element) {
    switch (typeof element) {
        case 'string':
            if (type !== 'string') {
                throw new TypeError("The new element type doesn't match the tensor data type.");
            }
            break;
        case 'number':
            if (type !== 'float32' && type !== 'int32') {
                throw new TypeError("The new element type doesn't match the tensor data type.");
            }
            if (type === 'float32' && Number.isInteger(element)) {
                throw new TypeError("The new element type doesn't match the tensor data type.");
            }
            if (type === 'int32' && !Number.isInteger(element)) {
                throw new TypeError("The new element type doesn't match the tensor data type.");
            }
            break;
        case 'boolean':
            if (type !== 'bool') {
                throw new TypeError("The new element type doesn't match the tensor data type.");
            }
            break;
        default:
            throw new TypeError("The new element type is not supported.");
    }
}
exports.matchElementType = matchElementType;
function validateIndices(indices) {
    var e_1, _a;
    if (indices.length < 0 || indices.length > 6) {
        throw new RangeError("Only rank 0 to 6 is supported for tensor shape.");
    }
    try {
        for (var indices_1 = __values(indices), indices_1_1 = indices_1.next(); !indices_1_1.done; indices_1_1 = indices_1.next()) {
            var n = indices_1_1.value;
            if (!Number.isInteger(n)) {
                throw new TypeError("Invalid index: " + n + " is not an integer");
            }
            if (n < 0 || n > 2147483647) {
                throw new TypeError("Invalid index: length " + n + " is not allowed");
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (indices_1_1 && !indices_1_1.done && (_a = indices_1.return)) _a.call(indices_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
}
exports.validateIndices = validateIndices;
//# sourceMappingURL=tensor-impl-utils.js.map