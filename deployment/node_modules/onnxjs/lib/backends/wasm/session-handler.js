"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.WasmSessionHandler = void 0;
var opset_1 = require("../../opset");
var op_resolve_rules_1 = require("../cpu/op-resolve-rules");
var inference_handler_1 = require("./inference-handler");
var op_resolve_rules_2 = require("./op-resolve-rules");
var WasmSessionHandler = /** @class */ (function () {
    function WasmSessionHandler(backend, context, fallbackToCpuOps) {
        this.backend = backend;
        this.context = context;
        this.opResolveRules = fallbackToCpuOps ? op_resolve_rules_2.WASM_OP_RESOLVE_RULES.concat(op_resolve_rules_1.CPU_OP_RESOLVE_RULES) : op_resolve_rules_2.WASM_OP_RESOLVE_RULES;
    }
    WasmSessionHandler.prototype.createInferenceHandler = function () {
        return new inference_handler_1.WasmInferenceHandler(this, this.context.profiler);
    };
    WasmSessionHandler.prototype.dispose = function () { };
    WasmSessionHandler.prototype.resolve = function (node, opsets) {
        var op = opset_1.resolveOperator(node, opsets, this.opResolveRules);
        op.initialize(node.attributes);
        return op;
    };
    return WasmSessionHandler;
}());
exports.WasmSessionHandler = WasmSessionHandler;
//# sourceMappingURL=session-handler.js.map