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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WasmGlobalMaxPool = exports.WasmMaxPool = exports.WasmGlobalAveragePool = exports.WasmAveragePool = void 0;
var pool_1 = require("../../../ops/pool");
var tensor_1 = require("../../../tensor");
var util_1 = require("../../../util");
var wasm_binding_1 = require("../../../wasm-binding");
var WasmAveragePool = /** @class */ (function (_super) {
    __extends(WasmAveragePool, _super);
    function WasmAveragePool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // overriding the checkInputTypes() in the base class because Wasm backend has special type limitations
    WasmAveragePool.prototype.checkInputTypes = function (inputs) {
        return checkInputTypes(inputs);
    };
    WasmAveragePool.prototype.run = function (inferenceHandler, inputs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, averagePool(inputs[0], this.autoPad, this.countIncludePad, this.kernelShape, this.pads, this.strides)];
            });
        });
    };
    return WasmAveragePool;
}(pool_1.AveragePool));
exports.WasmAveragePool = WasmAveragePool;
var WasmGlobalAveragePool = /** @class */ (function (_super) {
    __extends(WasmGlobalAveragePool, _super);
    function WasmGlobalAveragePool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // overriding the checkInputTypes() in the base class because Wasm backend has special type limitations
    WasmGlobalAveragePool.prototype.checkInputTypes = function (inputs) {
        return checkInputTypes(inputs);
    };
    WasmGlobalAveragePool.prototype.run = function (inferenceHandler, inputs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, globalAveragePool(inputs[0])];
            });
        });
    };
    return WasmGlobalAveragePool;
}(pool_1.GlobalAveragePool));
exports.WasmGlobalAveragePool = WasmGlobalAveragePool;
var WasmMaxPool = /** @class */ (function (_super) {
    __extends(WasmMaxPool, _super);
    function WasmMaxPool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // overriding the checkInputTypes() in the base class because Wasm backend has special type limitations
    WasmMaxPool.prototype.checkInputTypes = function (inputs) {
        return checkInputTypes(inputs);
    };
    WasmMaxPool.prototype.run = function (inferenceHandler, inputs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, maxPool(inputs[0], this.autoPad, this.kernelShape, this.pads, this.strides)];
            });
        });
    };
    return WasmMaxPool;
}(pool_1.MaxPool));
exports.WasmMaxPool = WasmMaxPool;
var WasmGlobalMaxPool = /** @class */ (function (_super) {
    __extends(WasmGlobalMaxPool, _super);
    function WasmGlobalMaxPool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    // overriding the checkInputTypes() in the base class because Wasm backend has special type limitations
    WasmGlobalMaxPool.prototype.checkInputTypes = function (inputs) {
        return checkInputTypes(inputs);
    };
    WasmGlobalMaxPool.prototype.run = function (inferenceHandler, inputs) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, globalMaxPool(inputs[0])];
            });
        });
    };
    return WasmGlobalMaxPool;
}(pool_1.GlobalMaxPool));
exports.WasmGlobalMaxPool = WasmGlobalMaxPool;
// type check function
function checkInputTypes(inputs) {
    // currently Wasm backend only supports 'float32' input type
    if (inputs[0].type !== 'float32') {
        return false;
    }
    return true;
}
// functions implementing specific pooling operations
function averagePool(input, autoPad, countIncludePad, kernelShape, pads, strides) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, pool(false, 1, input, autoPad, countIncludePad, kernelShape, pads, strides)];
        });
    });
}
function globalAveragePool(input) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, pool(true, 1, input, 'NOTSET', false, [], [], [])];
        });
    });
}
function maxPool(input, autoPad, kernelShape, pads, strides) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, pool(false, 2, input, autoPad, false, kernelShape, pads, strides)];
        });
    });
}
function globalMaxPool(input) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, pool(true, 2, input, 'NOTSET', false, [], [], [])];
        });
    });
}
/**
 * Perform pooling operations based on input
 * @param isGlobalOperator If true, perform global pooling.
 * @param poolType 1 if averagepool, 2 for maxpool.
 * @param input The input tensor.
 * @param autoPad DEPRECATED attribute supported for legacy models. Specifies how to implicitly calculate pads in each
 *     dimension. Can take values NOTSET, SAME_UPPER, SAME_LOWER, or VALID
 * @param countIncludePad Whether include pad pixels when calculating values for the edges.
 * @param kernelShape The size of the kernel along each axis.
 * @param pads Padding for the beginning and ending along each axis. `pads` format should be as follow [x1_begin,
 *       x2_begin...x1_end, x2_end,...], where xi_begin the number of pixels added at the beginning of axis `i` and
 *       xi_end, the number of pixels added at the end of axis `i`.
 * @param strides Stride along each axis.
 */
function pool(isGlobalOperator, poolType, input, autoPad, countIncludePad, kernelShape, pads, strides) {
    return __awaiter(this, void 0, void 0, function () {
        var poolFunc, outputDims, y, numThreads, xDimsSp, xSizeSp, xDimsFinal, yDimsSp, ySizeSp, yDimsFinal, workerTasks, X, Y, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    poolFunc = '';
                    switch (poolType) {
                        case 1:
                            poolFunc = '_average_pool_f32';
                            break;
                        case 2:
                            poolFunc = '_max_pool_f32';
                            break;
                        default:
                            throw new Error("unknown pool type");
                    }
                    // adjust the shapes of input attributes
                    util_1.PoolConvUtil.adjustPoolAttributes(isGlobalOperator, input.dims, kernelShape, strides, pads);
                    outputDims = util_1.PoolConvUtil.computePoolOutputShape(isGlobalOperator, input.dims, strides, kernelShape, pads, autoPad);
                    y = new tensor_1.Tensor(outputDims, input.type);
                    numThreads = determineNumThreads(input.dims[0], input.dims[1], wasm_binding_1.WasmBinding.workerNumber);
                    if (!(numThreads === 1)) return [3 /*break*/, 1];
                    wasm_binding_1.WasmBinding.getInstance().ccall(poolFunc, [kernelShape.length, 'int32'], [isGlobalOperator, 'bool'], [input.floatData, 'float32ptr'], [input.dims, 'int32ptr'], [y.floatData, 'float32ptr', 'out'], [y.dims, 'int32ptr'], [kernelShape, 'int32ptr'], [pads, 'int32ptr'], [strides, 'int32ptr'], [countIncludePad, 'bool']);
                    return [3 /*break*/, 3];
                case 1:
                    xDimsSp = input.dims.slice(0);
                    xDimsSp[1] = Math.floor(input.dims[1] / numThreads);
                    xSizeSp = util_1.ShapeUtil.size(xDimsSp);
                    xDimsFinal = input.dims.slice(0);
                    xDimsFinal[1] = input.dims[1] - (numThreads - 1) * xDimsSp[1];
                    yDimsSp = outputDims.slice(0);
                    yDimsSp[1] = xDimsSp[1];
                    ySizeSp = util_1.ShapeUtil.size(yDimsSp);
                    yDimsFinal = outputDims.slice(0);
                    yDimsFinal[1] = xDimsFinal[1];
                    workerTasks = new Array(numThreads - 1);
                    X = input.floatData;
                    Y = y.floatData;
                    // function calls
                    for (i = 0; i < numThreads; ++i) {
                        if (i !== numThreads - 1) {
                            workerTasks[i] = wasm_binding_1.WasmBinding.getInstance().ccallRemote(i, poolFunc, [kernelShape.length, 'int32'], [isGlobalOperator, 'bool'], [X.subarray(i * xSizeSp, (i + 1) * xSizeSp), 'float32ptr'], [xDimsSp, 'int32ptr'], [Y.subarray(i * ySizeSp, (i + 1) * ySizeSp), 'float32ptr', 'out'], [yDimsSp, 'int32ptr'], [kernelShape, 'int32ptr'], [pads, 'int32ptr'], [strides, 'int32ptr'], [countIncludePad, 'bool']);
                        }
                        else {
                            wasm_binding_1.WasmBinding.getInstance().ccall(poolFunc, [kernelShape.length, 'int32'], [isGlobalOperator, 'bool'], [X.subarray((numThreads - 1) * xSizeSp), 'float32ptr'], [xDimsFinal, 'int32ptr'], [Y.subarray((numThreads - 1) * ySizeSp), 'float32ptr', 'out'], [yDimsFinal, 'int32ptr'], [kernelShape, 'int32ptr'], [pads, 'int32ptr'], [strides, 'int32ptr'], [countIncludePad, 'bool']);
                        }
                    }
                    return [4 /*yield*/, Promise.all(workerTasks)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [2 /*return*/, [y]];
            }
        });
    });
}
// this function will determine the number of threads
// the strategy to parallelize is to parallelize on number of data channels
function determineNumThreads(batchSize, numChannels, numWebWorkers) {
    // single threaded if:
    // 1) batch size is not 1 (data splitting logic across threads is specific to batch size being 1)
    // 2) if number of channels is 1
    // 3) number of web workers is 0
    if (batchSize !== 1 || numChannels === 1 || numWebWorkers <= 0) {
        return 1;
    }
    // multi-threaded:
    // determine number of threads
    return Math.min(numChannels, numWebWorkers + 1);
}
//# sourceMappingURL=pool.js.map