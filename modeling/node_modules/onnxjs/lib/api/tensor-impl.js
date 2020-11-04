"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tensor = void 0;
// tslint:disable:use-named-parameter
var tensor_1 = require("../tensor");
var Utils = __importStar(require("./tensor-impl-utils"));
var Tensor = /** @class */ (function () {
    function Tensor(data, type, dims) {
        var inferredDims = dims ? dims : [data.length];
        if (data.length === 0) {
            throw new RangeError("Tensor data should contain at least one element.");
        }
        // convert regular arrays to typeArrays
        if (Array.isArray(data) && type !== 'string') {
            if (type === 'float32') {
                // convert number[] to Float32Array
                this.data = Float32Array.from(data);
            }
            else if (type === 'bool') {
                // convert boolean[] to Uint8Array
                // NOTE: there is a bug of Uint8Array.from() in Safari when using core-js. Use 'new Uint8Array' as workaround.
                // See also: https://github.com/zloirock/core-js/issues/285
                this.data = new Uint8Array(data);
            }
            else if (type === 'int32') {
                // convert number[] to Int32Array
                this.data = Int32Array.from(data);
            }
        }
        else {
            this.data = data;
        }
        this.dims = inferredDims;
        this.type = type;
        this.internalTensor = new tensor_1.Tensor(this.dims, this.type, undefined, undefined, this.data);
        this.size = this.internalTensor.size;
    }
    Tensor.prototype.get = function (indices) {
        var _this = this;
        var rest = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            rest[_i - 1] = arguments[_i];
        }
        var indexArray = [];
        if (typeof indices === 'number') {
            indexArray = __spread([indices], rest);
        }
        else if (indices) {
            indexArray = indices;
        }
        else {
            throw new Error("Input index array is undefined. ");
        }
        // check dims
        Utils.validateIndices(indexArray);
        if (indexArray.length !== this.dims.length) {
            throw new RangeError("Input index array dims don't match the tensor dims.");
        }
        // compute the flattened index
        indexArray.forEach(function (dim, idx) {
            if (dim >= _this.dims[idx]) {
                throw new RangeError("Input index array dims don't match the tensor dims.");
            }
        });
        var value = this.internalTensor.get(indexArray);
        if (this.type === 'bool') {
            return value === 1 ? true : false;
        }
        return value;
    };
    Tensor.prototype.set = function (value, indices) {
        var _this = this;
        var rest = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            rest[_i - 2] = arguments[_i];
        }
        Utils.matchElementType(this.type, value);
        var indexArray = [];
        if (typeof indices === 'number') {
            indexArray = __spread([indices], rest);
        }
        else if (indices) {
            indexArray = indices;
        }
        else {
            throw new Error("Input index array is undefined.");
        }
        // check dims
        Utils.validateIndices(indexArray);
        if (indexArray.length !== this.dims.length) {
            throw new RangeError("Input index array dims don't match the tensor dims.");
        }
        // compute the flattened index
        indexArray.forEach(function (dim, idx) {
            if (dim >= _this.dims[idx]) {
                throw new RangeError("Input index array dims don't match the tensor dims.");
            }
        });
        if (typeof value === 'boolean') {
            this.internalTensor.set(indexArray, value ? 1 : 0);
        }
        else {
            this.internalTensor.set(indexArray, value);
        }
    };
    return Tensor;
}());
exports.Tensor = Tensor;
//# sourceMappingURL=tensor-impl.js.map