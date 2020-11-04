"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.CpuSessionHandler = void 0;
var opset_1 = require("../../opset");
var inference_handler_1 = require("./inference-handler");
var op_resolve_rules_1 = require("./op-resolve-rules");
var CpuSessionHandler = /** @class */ (function () {
    function CpuSessionHandler(backend, context) {
        this.backend = backend;
        this.context = context;
    }
    CpuSessionHandler.prototype.createInferenceHandler = function () {
        return new inference_handler_1.CpuInferenceHandler(this, this.context.profiler);
    };
    CpuSessionHandler.prototype.dispose = function () { };
    CpuSessionHandler.prototype.resolve = function (node, opsets) {
        var op = opset_1.resolveOperator(node, opsets, op_resolve_rules_1.CPU_OP_RESOLVE_RULES);
        op.initialize(node.attributes);
        return op;
    };
    return CpuSessionHandler;
}());
exports.CpuSessionHandler = CpuSessionHandler;
//# sourceMappingURL=session-handler.js.map