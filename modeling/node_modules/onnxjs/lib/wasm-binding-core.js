"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.now = exports.WasmBinding = exports.init = void 0;
// some global parameters to deal with wasm binding initialization
var binding;
var initialized = false;
var initializing = false;
/**
 * initialize the WASM instance.
 *
 * this function should be called before any other calls to the WASM binding.
 */
function init() {
    if (initialized) {
        return Promise.resolve();
    }
    if (initializing) {
        throw new Error("multiple calls to 'init()' detected.");
    }
    initializing = true;
    return new Promise(function (resolve, reject) {
        // tslint:disable-next-line:no-require-imports
        binding = require('../dist/onnx-wasm');
        binding(binding).then(function () {
            // resolve init() promise
            resolve();
            initializing = false;
            initialized = true;
        }, function (err) {
            initializing = false;
            reject(err);
        });
    });
}
exports.init = init;
// class that deals with Wasm data interop and method calling
var WasmBinding = /** @class */ (function () {
    function WasmBinding() {
        this.ptr8 = 0;
        this.numBytesAllocated = 0;
    }
    /**
     * ccall in current thread
     * @param functionName
     * @param params
     */
    WasmBinding.prototype.ccall = function (functionName) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        if (!initialized) {
            throw new Error("wasm not initialized. please ensure 'init()' is called.");
        }
        var startTime = exports.now();
        var offset = [];
        var size = WasmBinding.calculateOffsets(offset, params);
        if (size > this.numBytesAllocated) {
            this.expandMemory(size);
        }
        WasmBinding.ccallSerialize(binding.HEAPU8.subarray(this.ptr8, this.ptr8 + size), offset, params);
        var startTimeFunc = exports.now();
        this.func(functionName, this.ptr8);
        var endTimeFunc = exports.now();
        WasmBinding.ccallDeserialize(binding.HEAPU8.subarray(this.ptr8, this.ptr8 + size), offset, params);
        var endTime = exports.now();
        return { startTime: startTime, endTime: endTime, startTimeFunc: startTimeFunc, endTimeFunc: endTimeFunc };
    };
    // raw ccall method  without invoking ccallSerialize() and ccallDeserialize()
    // user by ccallRemote() in the web-worker
    WasmBinding.prototype.ccallRaw = function (functionName, data) {
        if (!initialized) {
            throw new Error("wasm not initialized. please ensure 'init()' is called.");
        }
        var startTime = exports.now();
        var size = data.byteLength;
        if (size > this.numBytesAllocated) {
            this.expandMemory(size);
        }
        // copy input memory (data) to WASM heap
        binding.HEAPU8.subarray(this.ptr8, this.ptr8 + size).set(data);
        var startTimeFunc = exports.now();
        this.func(functionName, this.ptr8);
        var endTimeFunc = exports.now();
        // copy Wasm heap to output memory (data)
        data.set(binding.HEAPU8.subarray(this.ptr8, this.ptr8 + size));
        var endTime = exports.now();
        return { startTime: startTime, endTime: endTime, startTimeFunc: startTimeFunc, endTimeFunc: endTimeFunc };
    };
    WasmBinding.prototype.func = function (functionName, ptr8) {
        // tslint:disable-next-line:no-any
        var func = binding[functionName];
        func(ptr8);
    };
    WasmBinding.calculateOffsets = function (offset, params) {
        // calculate size and offset
        var size = 4 + 4 * params.length;
        for (var i = 0; i < params.length; i++) {
            var param = params[i];
            var paramData = param[0];
            var paramType = param[1];
            var paramPass = param[2];
            var len = 0;
            switch (paramType) {
                case 'bool':
                case 'int32':
                case 'float32':
                    len = 4;
                    break;
                case 'float64':
                    len = 8;
                    break;
                case 'boolptr':
                    if (!paramData) {
                        // deal with nullptr
                        offset.push(0);
                        continue;
                    }
                    else if (Array.isArray(paramData) || ArrayBuffer.isView(paramData)) {
                        len = 4 * Math.ceil(paramData.length / 4);
                    }
                    else {
                        throw new Error("boolptr requires boolean array or Uint8Array");
                    }
                    break;
                case 'int32ptr':
                case 'float32ptr':
                    if (!paramData) {
                        // deal with nullptr
                        offset.push(0);
                        continue;
                    }
                    else if (Array.isArray(paramData)) {
                        if (paramPass === 'inout' || paramPass === 'out') {
                            throw new TypeError("inout/out parameters must be ArrayBufferView for ptr types.");
                        }
                        len = paramData.length * 4;
                    }
                    else if (ArrayBuffer.isView(paramData)) {
                        len = paramData.byteLength;
                    }
                    else {
                        throw new TypeError("unsupported data type in 'ccall()'");
                    }
                    break;
                default:
                    throw new Error("not supported parameter type: " + paramType);
            }
            offset.push(size);
            size += len;
        }
        return size;
    };
    // tranfer data parameters (in/inout) to emscripten heap for ccall()
    WasmBinding.ccallSerialize = function (heapU8, offset, params) {
        var heap32 = new Int32Array(heapU8.buffer, heapU8.byteOffset);
        var heapU32 = new Uint32Array(heapU8.buffer, heapU8.byteOffset);
        var heapF32 = new Float32Array(heapU8.buffer, heapU8.byteOffset);
        heapU32[0] = params.length;
        for (var i = 0; i < params.length; i++) {
            var param = params[i];
            var paramData = param[0];
            var paramType = param[1];
            var paramPass = param[2];
            var offset8 = offset[i];
            var offset32 = offset8 >> 2;
            heapU32[i + 1] = offset8;
            if (paramPass === 'out' || offset8 === 0) {
                continue;
            }
            switch (paramType) {
                case 'bool':
                    heapU8[offset8] = paramData === true ? 1 : 0;
                    break;
                case 'int32':
                    heap32[offset32] = paramData;
                    break;
                case 'float32':
                    heapF32[offset32] = paramData;
                    break;
                case 'boolptr':
                    var boolArray = paramData;
                    // This will work for both Uint8Array as well as ReadonlyArray<boolean>
                    heapU8.subarray(offset8, offset8 + boolArray.length).set(paramData);
                    break;
                case 'int32ptr':
                    var int32Array = paramData;
                    heap32.subarray(offset32, offset32 + int32Array.length).set(int32Array);
                    break;
                case 'float32ptr':
                    var float32Array = paramData;
                    heapF32.subarray(offset32, offset32 + float32Array.length).set(float32Array);
                    break;
                default:
                    throw new Error("not supported parameter type: " + paramType);
            }
        }
    };
    // retrieve data parameters (in/inout) from emscripten heap after ccall()
    WasmBinding.ccallDeserialize = function (buffer, offset, params) {
        var heapF32 = new Float32Array(buffer.buffer, buffer.byteOffset);
        var heapU8 = new Uint8Array(buffer.buffer, buffer.byteOffset);
        for (var i = 0; i < params.length; i++) {
            var param = params[i];
            var paramData = param[0];
            var paramType = param[1];
            var paramPass = param[2];
            var offset8 = offset[i];
            // const offset16 = offset8 >> 1;
            var offset32 = offset8 >> 2;
            // const offset64 = offset8 >> 3;
            if (paramPass !== 'out' && paramPass !== 'inout') {
                continue;
            }
            switch (paramType) {
                case 'float32ptr':
                    var float32Array = paramData;
                    float32Array.set(heapF32.subarray(offset32, offset32 + float32Array.length));
                    break;
                case 'boolptr':
                    var boolArray = paramData;
                    boolArray.set(heapU8.subarray(offset8, offset8 + boolArray.length));
                    break;
                default:
                    throw new Error("not supported parameter type: " + paramType);
            }
        }
    };
    // function for defining memory allocation strategy
    WasmBinding.prototype.expandMemory = function (minBytesRequired) {
        // free already held memory if applicable
        if (this.ptr8 !== 0) {
            binding._free(this.ptr8);
        }
        // current simplistic strategy is to allocate 2 times the minimum bytes requested
        this.numBytesAllocated = 2 * minBytesRequired;
        this.ptr8 = binding._malloc(this.numBytesAllocated);
        if (this.ptr8 === 0) {
            throw new Error('Unable to allocate requested amount of memory. Failing.');
        }
    };
    WasmBinding.prototype.dispose = function () {
        if (!initialized) {
            throw new Error("wasm not initialized. please ensure 'init()' is called.");
        }
        if (this.ptr8 !== 0) {
            binding._free(this.ptr8);
        }
    };
    return WasmBinding;
}());
exports.WasmBinding = WasmBinding;
/**
 * returns a number to represent the current timestamp in a resolution as high as possible.
 */
exports.now = (typeof performance !== 'undefined' && performance.now) ? function () { return performance.now(); } : Date.now;
//# sourceMappingURL=wasm-binding-core.js.map