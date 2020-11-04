"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebGLBackend = void 0;
var instrument_1 = require("../instrument");
var session_handler_1 = require("./webgl/session-handler");
var webgl_context_factory_1 = require("./webgl/webgl-context-factory");
/**
 * WebGLBackend is the entry point for all WebGL opeartions
 * When it starts it created the WebGLRenderingContext
 * and other main framework components such as Program and Texture Managers
 */
var WebGLBackend = /** @class */ (function () {
    function WebGLBackend() {
    }
    WebGLBackend.prototype.initialize = function () {
        try {
            this.glContext = webgl_context_factory_1.createWebGLContext(this.contextId);
            if (typeof this.matmulMaxBatchSize !== 'number') {
                this.matmulMaxBatchSize = 16;
            }
            if (typeof this.textureCacheMode !== 'string') {
                this.textureCacheMode = 'full';
            }
            instrument_1.Logger.verbose('WebGLBackend', "Created WebGLContext: " + typeof this.glContext);
            return true;
        }
        catch (e) {
            instrument_1.Logger.warning('WebGLBackend', "Unable to initialize WebGLBackend. " + e);
            return false;
        }
    };
    WebGLBackend.prototype.createSessionHandler = function (context) {
        return new session_handler_1.WebGLSessionHandler(this, context);
    };
    WebGLBackend.prototype.dispose = function () {
        this.glContext.dispose();
    };
    return WebGLBackend;
}());
exports.WebGLBackend = WebGLBackend;
//# sourceMappingURL=backend-webgl.js.map