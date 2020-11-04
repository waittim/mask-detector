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
exports.WasmConv = void 0;
var conv_1 = require("../../../ops/conv");
var tensor_1 = require("../../../tensor");
var util_1 = require("../../../util");
var wasm_binding_1 = require("../../../wasm-binding");
var WasmConv = /** @class */ (function (_super) {
    __extends(WasmConv, _super);
    function WasmConv() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WasmConv.prototype.run = function (inferenceHandler, inputs) {
        return __awaiter(this, void 0, void 0, function () {
            var x, w, b, wDims, i, outputDims, y, numThreads, wDimsSp, wSizeSp, wDimsFinal, yDimsSp, ySizeSp, yDimsFinal, wArray, yArray, bArray, workerTasks, i;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        x = inputs[0];
                        w = inputs[1];
                        b = inputs.length === 3 ? inputs[2] : undefined;
                        // if kernelShape is not specified in the attributes of this op, infer it from the weight tensor dims
                        if (this.kernelShape.length === 0) {
                            wDims = inputs[1].dims;
                            for (i = 2; i < wDims.length; ++i) {
                                this.kernelShape.push(wDims[i]);
                            }
                        }
                        outputDims = util_1.PoolConvUtil.computeConvOutputShape(x.dims, w.dims, this.strides, this.dilations, this.kernelShape, this.pads, this.autoPad);
                        y = new tensor_1.Tensor(outputDims, x.type);
                        numThreads = determineNumThreads(x.dims[0], this.group, w.dims[0], wasm_binding_1.WasmBinding.workerNumber);
                        if (!(numThreads === 1)) return [3 /*break*/, 1];
                        wasm_binding_1.WasmBinding.getInstance().ccall('_conv_f32', [x.floatData, 'float32ptr'], [x.dims, 'int32ptr'], [w.floatData, 'float32ptr'], [w.dims, 'int32ptr'], [y.floatData, 'float32ptr', 'out'], [y.dims, 'int32ptr'], [b ? b.floatData : null, 'float32ptr'], [this.dilations, 'int32ptr'], [this.group, 'int32'], [this.pads, 'int32ptr'], [this.strides, 'int32ptr']);
                        return [2 /*return*/, [y]];
                    case 1:
                        wDimsSp = w.dims.slice(0);
                        wDimsSp[0] = Math.floor(w.dims[0] / numThreads);
                        wSizeSp = wDimsSp[0] * wDimsSp[1] * wDimsSp[2] * wDimsSp[3];
                        wDimsFinal = w.dims.slice(0);
                        wDimsFinal[0] = w.dims[0] - (numThreads - 1) * wDimsSp[0];
                        yDimsSp = [1, wDimsSp[0], outputDims[2], outputDims[3]];
                        ySizeSp = wDimsSp[0] * outputDims[2] * outputDims[3];
                        yDimsFinal = [1, wDimsFinal[0], outputDims[2], outputDims[3]];
                        wArray = new Array(numThreads);
                        yArray = new Array(numThreads);
                        bArray = new Array(numThreads);
                        workerTasks = new Array(numThreads - 1);
                        // function calls
                        for (i = 0; i < numThreads; ++i) {
                            if (i !== numThreads - 1) {
                                wArray[i] = w.floatData.subarray(i * wSizeSp, (i + 1) * wSizeSp);
                                yArray[i] = y.floatData.subarray(i * ySizeSp, (i + 1) * ySizeSp);
                                if (b) {
                                    bArray[i] = b.floatData.subarray(i * wDimsSp[0], (i + 1) * wDimsSp[0]);
                                }
                                workerTasks[i] = wasm_binding_1.WasmBinding.getInstance().ccallRemote(i, '_conv_f32', [x.floatData, 'float32ptr'], [x.dims, 'int32ptr'], [wArray[i], 'float32ptr'], [wDimsSp, 'int32ptr'], [yArray[i], 'float32ptr', 'out'], [yDimsSp, 'int32ptr'], [bArray.length > 0 ? bArray[i] : null, 'float32ptr'], [this.dilations, 'int32ptr'], [this.group, 'int32'], [this.pads, 'int32ptr'], [this.strides, 'int32ptr']);
                            }
                            else {
                                wArray[i] = w.floatData.subarray(i * wSizeSp);
                                yArray[i] = y.floatData.subarray(i * ySizeSp);
                                if (b) {
                                    bArray[i] = b.floatData.subarray(i * wDimsSp[0]);
                                }
                                wasm_binding_1.WasmBinding.getInstance().ccall('_conv_f32', [x.floatData, 'float32ptr'], [x.dims, 'int32ptr'], [wArray[i], 'float32ptr'], [wDimsFinal, 'int32ptr'], [yArray[i], 'float32ptr', 'out'], [yDimsFinal, 'int32ptr'], [bArray.length > 0 ? bArray[i] : null, 'float32ptr'], [this.dilations, 'int32ptr'], [this.group, 'int32'], [this.pads, 'int32ptr'], [this.strides, 'int32ptr']);
                            }
                        }
                        return [4 /*yield*/, Promise.all(workerTasks)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, [y]];
                }
            });
        });
    };
    // overriding the checkInputTypes() in the base class because Wasm backend has special type limitations
    WasmConv.prototype.checkInputTypes = function (inputs) {
        // currently Wasm backend only supports 'float32' input type
        if (inputs[0].type !== 'float32' || inputs[1].type !== 'float32') {
            return false;
        }
        if (inputs.length === 3 && inputs[2].type !== 'float32') {
            return false;
        }
        return true;
    };
    return WasmConv;
}(conv_1.Conv));
exports.WasmConv = WasmConv;
// This function will determine the number of threads
// The strategy to parallelize is to parallelize on number of filter maps in the kernel
// (i.e.) number of output channels
function determineNumThreads(batchSize, group, numFilterMaps, numWebWorkers) {
    // single threaded if:
    // 1) batch size is not 1 (data splitting logic across threads is specific to batch size being 1)
    // 2) multi-threading not supported yet for mulitple groups
    // 3) if number of filter maps is 1
    // 4) number of web workers is 0
    if (batchSize !== 1 || group !== 1 || numFilterMaps === 1 || numWebWorkers <= 0) {
        return 1;
    }
    // multi-threaded:
    // determine number of threads
    return Math.min(numFilterMaps, numWebWorkers + 1);
}
//# sourceMappingURL=conv.js.map