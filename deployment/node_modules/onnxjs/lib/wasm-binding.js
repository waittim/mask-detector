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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WasmBinding = exports.init = void 0;
var instrument_1 = require("./instrument");
var bindingCore = __importStar(require("./wasm-binding-core"));
var workers;
var WORKER_NUMBER;
var completeCallbacks;
var initialized = false;
var initializing = false;
/**
 * initialize the WASM instance.
 *
 * this function should be called before any other calls to methods in WasmBinding.
 */
function init(numWorkers, initTimeout) {
    if (initialized) {
        return Promise.resolve();
    }
    if (initializing) {
        throw new Error("multiple calls to 'init()' detected.");
    }
    initializing = true;
    return new Promise(function (resolve, reject) {
        // the timeout ID that used as a guard for rejecting binding init.
        // we set the type of this variable to unknown because the return type of function 'setTimeout' is different
        // in node.js (type Timeout) and browser (number)
        var waitForBindingInitTimeoutId;
        var clearWaitForBindingInit = function () {
            if (waitForBindingInitTimeoutId !== undefined) {
                // tslint:disable-next-line:no-any
                clearTimeout(waitForBindingInitTimeoutId);
                waitForBindingInitTimeoutId = undefined;
            }
        };
        var onFulfilled = function () {
            clearWaitForBindingInit();
            resolve();
            initializing = false;
            initialized = true;
        };
        var onRejected = function (err) {
            clearWaitForBindingInit();
            reject(err);
            initializing = false;
        };
        var bindingInitTask = bindingCore.init();
        // a promise that gets rejected after 5s to work around the fact that
        // there is an unrejected promise in the wasm glue logic file when
        // it has some problem instantiating the wasm file
        var rejectAfterTimeOutPromise = new Promise(function (resolve, reject) {
            waitForBindingInitTimeoutId = setTimeout(function () {
                reject('Wasm init promise failed to be resolved within set timeout');
            }, initTimeout);
        });
        // user requests positive number of workers
        if (numWorkers > 0) {
            instrument_1.Logger.verbose('WebAssembly-Workers', "User has requested " + numWorkers + " Workers.");
            // check if environment supports usage of workers
            if (areWebWorkersSupported()) {
                instrument_1.Logger.verbose('WebAssembly-Workers', "Environment supports usage of Workers. Will spawn " + numWorkers + " Workers");
                WORKER_NUMBER = numWorkers;
            }
            else {
                instrument_1.Logger.error('WebAssembly-Workers', 'Environment does not support usage of Workers. Will not spawn workers.');
                WORKER_NUMBER = 0;
            }
        }
        // user explicitly disables workers
        else {
            instrument_1.Logger.verbose('WebAssembly-Workers', 'User has disabled usage of Workers. Will not spawn workers.');
            WORKER_NUMBER = 0;
        }
        var workerInitTasks = new Array(WORKER_NUMBER);
        workers = new Array(WORKER_NUMBER);
        completeCallbacks = new Array(WORKER_NUMBER);
        var _loop_1 = function (workerId) {
            var workerInitTask = new Promise(function (resolveWorkerInit, rejectWorkerInit) {
                // tslint:disable-next-line
                var worker = require('worker-loader?filename=onnx-worker.js!./worker/worker-main').default();
                workers[workerId] = worker;
                completeCallbacks[workerId] = [];
                worker.onerror = function (e) {
                    instrument_1.Logger.error('WebAssembly-Workers', "worker-" + workerId + " ERR: " + e);
                    if (initialized) {
                        // TODO: we need error-handling logic
                    }
                    else {
                        rejectWorkerInit();
                    }
                };
                worker.onmessage = function (e) {
                    if (e && e.data && e.data.type) {
                        if (e.data.type === 'init-success') {
                            resolveWorkerInit();
                        }
                        else if (e.data.type === 'ccall') {
                            var perfData = e.data.perfData;
                            completeCallbacks[workerId].shift()(e.data.buffer, perfData);
                        }
                        else {
                            throw new Error("unknown message type from worker: " + e.data.type);
                        }
                    }
                    else {
                        throw new Error("missing message type from worker");
                    }
                };
            });
            workerInitTasks[workerId] = workerInitTask;
        };
        for (var workerId = 0; workerId < WORKER_NUMBER; workerId++) {
            _loop_1(workerId);
        }
        // TODO: Fix this hack to work-around the fact that the Wasm binding instantiate promise
        // is unrejected incase there is a fatal exception (missing wasm file for example)
        // we impose a healthy timeout (should not affect core framework performance)
        Promise.race([bindingInitTask, rejectAfterTimeOutPromise])
            .then(function () {
            // Wasm init promise resolved
            Promise.all(workerInitTasks)
                .then(
            // Wasm AND Web-worker init promises resolved. SUCCESS!!
            onFulfilled, 
            // Wasm init promise resolved. Some (or all) web-worker init promises failed to be resolved.
            // PARTIAL SUCCESS. Use Wasm backend with no web-workers (best-effort).
            function (e) {
                instrument_1.Logger.warning('WebAssembly-Workers', "Unable to get all requested workers initialized. Will use Wasm backend with 0 workers. ERR: " + e);
                // TODO: need house-keeping logic to cull exisitng successfully initialized workers
                WORKER_NUMBER = 0;
                onFulfilled();
            });
        }, 
        // Wasm init promise failed to be resolved. COMPLETE FAILURE. Reject this init promise.
        onRejected);
    });
}
exports.init = init;
// Extending the WasmBinding class to deal with web-worker specific logic here
var WasmBinding = /** @class */ (function (_super) {
    __extends(WasmBinding, _super);
    function WasmBinding() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WasmBinding.getInstance = function () {
        if (!WasmBinding.instance) {
            WasmBinding.instance = new WasmBinding();
        }
        return WasmBinding.instance;
    };
    Object.defineProperty(WasmBinding, "workerNumber", {
        get: function () {
            return WORKER_NUMBER;
        },
        enumerable: false,
        configurable: true
    });
    WasmBinding.prototype.ccallRemote = function (workerId, functionName) {
        var params = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            params[_i - 2] = arguments[_i];
        }
        if (!initialized) {
            throw new Error("wasm not initialized. please ensure 'init()' is called.");
        }
        if (workerId < 0 || workerId >= WORKER_NUMBER) {
            throw new Error("invalid worker ID " + workerId + ". should be in range [0, " + WORKER_NUMBER + ")");
        }
        var offset = [];
        var size = WasmBinding.calculateOffsets(offset, params);
        var buffer = new ArrayBuffer(size);
        WasmBinding.ccallSerialize(new Uint8Array(buffer), offset, params);
        var startTime = bindingCore.now();
        workers[workerId].postMessage({ type: 'ccall', func: functionName, buffer: buffer }, [buffer]);
        return new Promise(function (resolve, reject) {
            completeCallbacks[workerId].push(function (buffer, perf) {
                perf.startTimeWorker = perf.startTime;
                perf.endTimeWorker = perf.endTime;
                perf.startTime = startTime;
                perf.endTime = bindingCore.now();
                WasmBinding.ccallDeserialize(new Uint8Array(buffer), offset, params);
                resolve(perf);
            });
        });
    };
    return WasmBinding;
}(bindingCore.WasmBinding));
exports.WasmBinding = WasmBinding;
function areWebWorkersSupported() {
    // very simplistic check to make sure the environment supports usage of workers
    // tslint:disable-next-line:no-any
    if (typeof window !== 'undefined' && typeof window.Worker !== 'undefined') {
        return true;
    }
    return false;
}
//# sourceMappingURL=wasm-binding.js.map