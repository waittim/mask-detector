"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tensor = void 0;
var long_1 = __importDefault(require("long"));
var onnx_proto_1 = require("onnx-proto");
var util_1 = require("./util");
var Tensor = /** @class */ (function () {
    function Tensor(
    /**
     * get the dimensions of the tensor
     */
    dims, 
    /**
     * get the type of the tensor
     */
    type, dataProvider, asyncDataProvider, cache, 
    /**
     * get the data ID that used to map to a tensor data
     */
    dataId) {
        if (dataId === void 0) { dataId = {}; }
        this.dims = dims;
        this.type = type;
        this.dataProvider = dataProvider;
        this.asyncDataProvider = asyncDataProvider;
        this.cache = cache;
        this.dataId = dataId;
        this.size = util_1.ShapeUtil.validateDimsAndCalcSize(dims);
        var size = this.size;
        var empty = (dataProvider === undefined && asyncDataProvider === undefined && cache === undefined);
        if (cache !== undefined) {
            if (cache.length !== size) {
                throw new RangeError("Input dims doesn't match data length.");
            }
        }
        if (type === 'string') {
            if (cache !== undefined && (!Array.isArray(cache) || !cache.every(function (i) { return typeof i === 'string'; }))) {
                throw new TypeError("cache should be a string array");
            }
            if (empty) {
                cache = new Array(size);
            }
        }
        else {
            if (cache !== undefined) {
                var constructor = dataviewConstructor(type);
                if (!(cache instanceof constructor)) {
                    throw new TypeError("cache should be type " + constructor.name);
                }
            }
            if (empty) {
                var buf = new ArrayBuffer(size * sizeof(type));
                this.cache = createView(buf, type);
            }
        }
    }
    Object.defineProperty(Tensor.prototype, "data", {
        /**
         * get the underlying tensor data
         */
        get: function () {
            if (this.cache === undefined) {
                var data = this.dataProvider(this.dataId);
                if (data.length !== this.size) {
                    throw new Error("Length of data provided by the Data Provider is inconsistent with the dims of this Tensor.");
                }
                this.cache = data;
            }
            return this.cache;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tensor.prototype, "stringData", {
        /**
         * get the underlying string tensor data. Should only use when type is STRING
         */
        get: function () {
            if (this.type !== 'string') {
                throw new TypeError("data type is not string");
            }
            return this.data;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tensor.prototype, "integerData", {
        /**
         * get the underlying integer tensor data. Should only use when type is one of the following: (UINT8, INT8, UINT16,
         * INT16, INT32, UINT32, BOOL)
         */
        get: function () {
            switch (this.type) {
                case 'uint8':
                case 'int8':
                case 'uint16':
                case 'int16':
                case 'int32':
                case 'uint32':
                case 'bool':
                    return this.data;
                default:
                    throw new TypeError("data type is not integer (uint8, int8, uint16, int16, int32, uint32, bool)");
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tensor.prototype, "floatData", {
        /**
         * get the underlying float tensor data. Should only use when type is one of the following: (FLOAT, DOUBLE)
         */
        get: function () {
            switch (this.type) {
                case 'float32':
                case 'float64':
                    return this.data;
                default:
                    throw new TypeError("data type is not float (float32, float64)");
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Tensor.prototype, "numberData", {
        /**
         * get the underlying number tensor data. Should only use when type is one of the following: (UINT8, INT8, UINT16,
         * INT16, INT32, UINT32, BOOL, FLOAT, DOUBLE)
         */
        get: function () {
            if (this.type !== 'string') {
                return this.data;
            }
            throw new TypeError("type cannot be non-number (string)");
        },
        enumerable: false,
        configurable: true
    });
    /**
     * get value of an element at the given indices
     */
    Tensor.prototype.get = function (indices) {
        return this.data[util_1.ShapeUtil.indicesToOffset(indices, this.strides)];
    };
    /**
     * set value of an element at the given indices
     */
    Tensor.prototype.set = function (indices, value) {
        this.data[util_1.ShapeUtil.indicesToOffset(indices, this.strides)] = value;
    };
    /**
     * get the underlying tensor data asynchronously
     */
    Tensor.prototype.getData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(this.cache === undefined)) return [3 /*break*/, 2];
                        _a = this;
                        return [4 /*yield*/, this.asyncDataProvider(this.dataId)];
                    case 1:
                        _a.cache = _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, this.cache];
                }
            });
        });
    };
    Object.defineProperty(Tensor.prototype, "strides", {
        /**
         * get the strides for each dimension
         */
        get: function () {
            if (!this._strides) {
                this._strides = util_1.ShapeUtil.computeStrides(this.dims);
            }
            return this._strides;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Construct new Tensor from a ONNX Tensor object
     * @param tensorProto the ONNX Tensor
     */
    Tensor.fromProto = function (tensorProto) {
        if (!tensorProto) {
            throw new Error('cannot construct Value from an empty tensor');
        }
        var type = util_1.ProtoUtil.tensorDataTypeFromProto(tensorProto.dataType);
        var dims = util_1.ProtoUtil.tensorDimsFromProto(tensorProto.dims);
        var value = new Tensor(dims, type);
        if (type === 'string') {
            // When it's STRING type, the value should always be stored in field
            // 'stringData'
            tensorProto.stringData.forEach(function (str, i) {
                var buf = Buffer.from(str.buffer, str.byteOffset, str.byteLength);
                value.data[i] = buf.toString();
            });
        }
        else if (tensorProto.rawData && typeof tensorProto.rawData.byteLength === 'number' &&
            tensorProto.rawData.byteLength > 0) {
            // NOT considering segment for now (IMPORTANT)
            // populate value from rawData
            var dataDest = value.data;
            var dataSource = new DataView(tensorProto.rawData.buffer, tensorProto.rawData.byteOffset, tensorProto.rawData.byteLength);
            var elementSize = sizeofProto(tensorProto.dataType);
            var length_1 = tensorProto.rawData.byteLength / elementSize;
            if (tensorProto.rawData.byteLength % elementSize !== 0) {
                throw new Error("invalid buffer length");
            }
            if (dataDest.length !== length_1) {
                throw new Error("buffer length mismatch");
            }
            for (var i = 0; i < length_1; i++) {
                var n = readProto(dataSource, tensorProto.dataType, i * elementSize);
                dataDest[i] = n;
            }
        }
        else {
            // populate value from array
            var array = void 0;
            switch (tensorProto.dataType) {
                case onnx_proto_1.onnx.TensorProto.DataType.FLOAT:
                    array = tensorProto.floatData;
                    break;
                case onnx_proto_1.onnx.TensorProto.DataType.INT32:
                case onnx_proto_1.onnx.TensorProto.DataType.INT16:
                case onnx_proto_1.onnx.TensorProto.DataType.UINT16:
                case onnx_proto_1.onnx.TensorProto.DataType.INT8:
                case onnx_proto_1.onnx.TensorProto.DataType.UINT8:
                case onnx_proto_1.onnx.TensorProto.DataType.BOOL:
                    array = tensorProto.int32Data;
                    break;
                case onnx_proto_1.onnx.TensorProto.DataType.INT64:
                    array = tensorProto.int64Data;
                    break;
                case onnx_proto_1.onnx.TensorProto.DataType.DOUBLE:
                    array = tensorProto.doubleData;
                    break;
                case onnx_proto_1.onnx.TensorProto.DataType.UINT32:
                case onnx_proto_1.onnx.TensorProto.DataType.UINT64:
                    array = tensorProto.uint64Data;
                    break;
                default:
                    // should never run here
                    throw new Error('unspecific error');
            }
            if (array === null || array === undefined) {
                throw new Error('failed to populate data from a tensorproto value');
            }
            var data = value.data;
            if (data.length !== array.length) {
                throw new Error("array length mismatch");
            }
            for (var i = 0; i < array.length; i++) {
                var element = array[i];
                if (long_1.default.isLong(element)) {
                    data[i] = longToNumber(element, tensorProto.dataType);
                }
                else {
                    data[i] = element;
                }
            }
        }
        return value;
    };
    /**
     * Construct new Tensor from raw data
     * @param data the raw data object. Should be a string array for 'string' tensor, and the corresponding typed array
     * for other types of tensor.
     * @param dims the dimensions of the tensor
     * @param type the type of the tensor
     */
    Tensor.fromData = function (data, dims, type) {
        return new Tensor(dims, type, undefined, undefined, data);
    };
    return Tensor;
}());
exports.Tensor = Tensor;
function sizeof(type) {
    switch (type) {
        case 'bool':
        case 'int8':
        case 'uint8':
            return 1;
        case 'int16':
        case 'uint16':
            return 2;
        case 'int32':
        case 'uint32':
        case 'float32':
            return 4;
        case 'float64':
            return 8;
        default:
            throw new Error("cannot calculate sizeof() on type " + type);
    }
}
function sizeofProto(type) {
    switch (type) {
        case onnx_proto_1.onnx.TensorProto.DataType.UINT8:
        case onnx_proto_1.onnx.TensorProto.DataType.INT8:
        case onnx_proto_1.onnx.TensorProto.DataType.BOOL:
            return 1;
        case onnx_proto_1.onnx.TensorProto.DataType.UINT16:
        case onnx_proto_1.onnx.TensorProto.DataType.INT16:
            return 2;
        case onnx_proto_1.onnx.TensorProto.DataType.FLOAT:
        case onnx_proto_1.onnx.TensorProto.DataType.INT32:
        case onnx_proto_1.onnx.TensorProto.DataType.UINT32:
            return 4;
        case onnx_proto_1.onnx.TensorProto.DataType.INT64:
        case onnx_proto_1.onnx.TensorProto.DataType.DOUBLE:
        case onnx_proto_1.onnx.TensorProto.DataType.UINT64:
            return 8;
        default:
            throw new Error("cannot calculate sizeof() on type " + onnx_proto_1.onnx.TensorProto.DataType[type]);
    }
}
function createView(dataBuffer, type) {
    return new (dataviewConstructor(type))(dataBuffer);
}
function dataviewConstructor(type) {
    switch (type) {
        case 'bool':
        case 'uint8':
            return Uint8Array;
        case 'int8':
            return Int8Array;
        case 'int16':
            return Int16Array;
        case 'uint16':
            return Uint16Array;
        case 'int32':
            return Int32Array;
        case 'uint32':
            return Uint32Array;
        case 'float32':
            return Float32Array;
        case 'float64':
            return Float64Array;
        default:
            // should never run to here
            throw new Error('unspecified error');
    }
}
// convert a long number to a 32-bit integer (cast-down)
function longToNumber(i, type) {
    // INT64, UINT32, UINT64
    if (type === onnx_proto_1.onnx.TensorProto.DataType.INT64) {
        if (i.greaterThanOrEqual(2147483648) || i.lessThan(-2147483648)) {
            throw new TypeError('int64 is not supported');
        }
    }
    else if (type === onnx_proto_1.onnx.TensorProto.DataType.UINT32 || type === onnx_proto_1.onnx.TensorProto.DataType.UINT64) {
        if (i.greaterThanOrEqual(4294967296) || i.lessThan(0)) {
            throw new TypeError('uint64 is not supported');
        }
    }
    else {
        throw new TypeError("not a LONG type: " + onnx_proto_1.onnx.TensorProto.DataType[type]);
    }
    return i.toNumber();
}
// read one value from TensorProto
function readProto(view, type, byteOffset) {
    switch (type) {
        case onnx_proto_1.onnx.TensorProto.DataType.BOOL:
        case onnx_proto_1.onnx.TensorProto.DataType.UINT8:
            return view.getUint8(byteOffset);
        case onnx_proto_1.onnx.TensorProto.DataType.INT8:
            return view.getInt8(byteOffset);
        case onnx_proto_1.onnx.TensorProto.DataType.UINT16:
            return view.getUint16(byteOffset, true);
        case onnx_proto_1.onnx.TensorProto.DataType.INT16:
            return view.getInt16(byteOffset, true);
        case onnx_proto_1.onnx.TensorProto.DataType.FLOAT:
            return view.getFloat32(byteOffset, true);
        case onnx_proto_1.onnx.TensorProto.DataType.INT32:
            return view.getInt32(byteOffset, true);
        case onnx_proto_1.onnx.TensorProto.DataType.UINT32:
            return view.getUint32(byteOffset, true);
        case onnx_proto_1.onnx.TensorProto.DataType.INT64:
            return longToNumber(long_1.default.fromBits(view.getUint32(byteOffset, true), view.getUint32(byteOffset + 4, true), false), type);
        case onnx_proto_1.onnx.TensorProto.DataType.DOUBLE:
            return view.getFloat64(byteOffset, true);
        case onnx_proto_1.onnx.TensorProto.DataType.UINT64:
            return longToNumber(long_1.default.fromBits(view.getUint32(byteOffset, true), view.getUint32(byteOffset + 4, true), true), type);
        default:
            throw new Error("cannot read from DataView for type " + onnx_proto_1.onnx.TensorProto.DataType[type]);
    }
}
//# sourceMappingURL=tensor.js.map