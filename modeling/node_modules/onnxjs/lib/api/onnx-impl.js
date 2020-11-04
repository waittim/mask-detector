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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !exports.hasOwnProperty(p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = exports.backend = void 0;
var backend_cpu_1 = require("../backends/backend-cpu");
var backend_wasm_1 = require("../backends/backend-wasm");
var backend_webgl_1 = require("../backends/backend-webgl");
var env_impl_1 = require("./env-impl");
__exportStar(require("./env"), exports);
__exportStar(require("./onnx"), exports);
__exportStar(require("./tensor"), exports);
__exportStar(require("./inference-session"), exports);
exports.backend = {
    cpu: new backend_cpu_1.CpuBackend(),
    wasm: new backend_wasm_1.WasmBackend(),
    webgl: new backend_webgl_1.WebGLBackend()
};
exports.ENV = env_impl_1.envImpl;
//# sourceMappingURL=onnx-impl.js.map