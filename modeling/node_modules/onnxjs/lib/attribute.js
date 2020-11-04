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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Attribute = void 0;
var long_1 = __importDefault(require("long"));
var onnx_proto_1 = require("onnx-proto");
var tensor_1 = require("./tensor");
var util_1 = require("./util");
var Attribute = /** @class */ (function () {
    function Attribute(attributes) {
        var e_1, _a;
        this._attributes = new Map();
        if (attributes !== null && attributes !== undefined) {
            try {
                for (var attributes_1 = __values(attributes), attributes_1_1 = attributes_1.next(); !attributes_1_1.done; attributes_1_1 = attributes_1.next()) {
                    var attr = attributes_1_1.value;
                    this._attributes.set(attr.name, [Attribute.getValue(attr), Attribute.getType(attr)]);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (attributes_1_1 && !attributes_1_1.done && (_a = attributes_1.return)) _a.call(attributes_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            if (this._attributes.size < attributes.length) {
                throw new Error('duplicated attribute names');
            }
        }
    }
    Attribute.prototype.set = function (key, type, value) {
        this._attributes.set(key, [value, type]);
    };
    Attribute.prototype.delete = function (key) {
        this._attributes.delete(key);
    };
    Attribute.prototype.getFloat = function (key, defaultValue) {
        return this.get(key, 'float', defaultValue);
    };
    Attribute.prototype.getInt = function (key, defaultValue) {
        return this.get(key, 'int', defaultValue);
    };
    Attribute.prototype.getString = function (key, defaultValue) {
        return this.get(key, 'string', defaultValue);
    };
    Attribute.prototype.getTensor = function (key, defaultValue) {
        return this.get(key, 'tensor', defaultValue);
    };
    Attribute.prototype.getFloats = function (key, defaultValue) {
        return this.get(key, 'floats', defaultValue);
    };
    Attribute.prototype.getInts = function (key, defaultValue) {
        return this.get(key, 'ints', defaultValue);
    };
    Attribute.prototype.getStrings = function (key, defaultValue) {
        return this.get(key, 'strings', defaultValue);
    };
    Attribute.prototype.getTensors = function (key, defaultValue) {
        return this.get(key, 'tensors', defaultValue);
    };
    Attribute.prototype.get = function (key, type, defaultValue) {
        var valueAndType = this._attributes.get(key);
        if (valueAndType === undefined) {
            if (defaultValue !== undefined) {
                return defaultValue;
            }
            throw new Error("required attribute not found: " + key);
        }
        if (valueAndType[1] !== type) {
            throw new Error("type mismatch: expected " + type + " but got " + valueAndType[1]);
        }
        return valueAndType[0];
    };
    Attribute.getType = function (attr) {
        switch (attr.type) {
            case onnx_proto_1.onnx.AttributeProto.AttributeType.FLOAT:
                return 'float';
            case onnx_proto_1.onnx.AttributeProto.AttributeType.INT:
                return 'int';
            case onnx_proto_1.onnx.AttributeProto.AttributeType.STRING:
                return 'string';
            case onnx_proto_1.onnx.AttributeProto.AttributeType.TENSOR:
                return 'tensor';
            case onnx_proto_1.onnx.AttributeProto.AttributeType.FLOATS:
                return 'floats';
            case onnx_proto_1.onnx.AttributeProto.AttributeType.INTS:
                return 'ints';
            case onnx_proto_1.onnx.AttributeProto.AttributeType.STRINGS:
                return 'strings';
            case onnx_proto_1.onnx.AttributeProto.AttributeType.TENSORS:
                return 'tensors';
            default:
                throw new Error("attribute type is not supported yet: " + onnx_proto_1.onnx.AttributeProto.AttributeType[attr.type]);
        }
    };
    Attribute.getValue = function (attr) {
        if (attr.type === onnx_proto_1.onnx.AttributeProto.AttributeType.GRAPH ||
            attr.type === onnx_proto_1.onnx.AttributeProto.AttributeType.GRAPHS) {
            throw new Error('graph attribute is not supported yet');
        }
        var value = this.getValueNoCheck(attr);
        // cast LONG to number
        if (attr.type === onnx_proto_1.onnx.AttributeProto.AttributeType.INT && long_1.default.isLong(value)) {
            return value.toNumber();
        }
        // cast LONG[] to number[]
        if (attr.type === onnx_proto_1.onnx.AttributeProto.AttributeType.INTS) {
            var arr = value;
            var numberValue = new Array(arr.length);
            for (var i = 0; i < arr.length; i++) {
                var maybeLong = arr[i];
                numberValue[i] = util_1.LongUtil.longToNumber(maybeLong);
            }
            return numberValue;
        }
        // cast onnx.TensorProto to onnxjs.Tensor
        if (attr.type === onnx_proto_1.onnx.AttributeProto.AttributeType.TENSOR) {
            return tensor_1.Tensor.fromProto(value);
        }
        // cast onnx.TensorProto[] to onnxjs.Tensor[]
        if (attr.type === onnx_proto_1.onnx.AttributeProto.AttributeType.TENSORS) {
            var tensorProtos = value;
            return tensorProtos.map(function (value) { return tensor_1.Tensor.fromProto(value); });
        }
        // cast Uint8Array to string
        if (attr.type === onnx_proto_1.onnx.AttributeProto.AttributeType.STRING) {
            var utf8String = value;
            return Buffer.from(utf8String.buffer, utf8String.byteOffset, utf8String.byteLength).toString();
        }
        // cast Uint8Array[] to string[]
        if (attr.type === onnx_proto_1.onnx.AttributeProto.AttributeType.STRINGS) {
            var utf8Strings = value;
            return utf8Strings.map(function (utf8String) { return Buffer.from(utf8String.buffer, utf8String.byteOffset, utf8String.byteLength).toString(); });
        }
        return value;
    };
    Attribute.getValueNoCheck = function (attr) {
        switch (attr.type) {
            case onnx_proto_1.onnx.AttributeProto.AttributeType.FLOAT:
                return attr.f;
            case onnx_proto_1.onnx.AttributeProto.AttributeType.INT:
                return attr.i;
            case onnx_proto_1.onnx.AttributeProto.AttributeType.STRING:
                return attr.s;
            case onnx_proto_1.onnx.AttributeProto.AttributeType.TENSOR:
                return attr.t;
            case onnx_proto_1.onnx.AttributeProto.AttributeType.GRAPH:
                return attr.g;
            case onnx_proto_1.onnx.AttributeProto.AttributeType.FLOATS:
                return attr.floats;
            case onnx_proto_1.onnx.AttributeProto.AttributeType.INTS:
                return attr.ints;
            case onnx_proto_1.onnx.AttributeProto.AttributeType.STRINGS:
                return attr.strings;
            case onnx_proto_1.onnx.AttributeProto.AttributeType.TENSORS:
                return attr.tensors;
            case onnx_proto_1.onnx.AttributeProto.AttributeType.GRAPHS:
                return attr.graphs;
            default:
                throw new Error("unsupported attribute type: " + onnx_proto_1.onnx.AttributeProto.AttributeType[attr.type]);
        }
    };
    return Attribute;
}());
exports.Attribute = Attribute;
//# sourceMappingURL=attribute.js.map