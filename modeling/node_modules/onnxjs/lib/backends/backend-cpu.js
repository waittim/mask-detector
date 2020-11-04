"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.CpuBackend = void 0;
var session_handler_1 = require("./cpu/session-handler");
var CpuBackend = /** @class */ (function () {
    function CpuBackend() {
    }
    CpuBackend.prototype.initialize = function () {
        return true;
    };
    CpuBackend.prototype.createSessionHandler = function (context) {
        return new session_handler_1.CpuSessionHandler(this, context);
    };
    CpuBackend.prototype.dispose = function () { };
    return CpuBackend;
}());
exports.CpuBackend = CpuBackend;
//# sourceMappingURL=backend-cpu.js.map