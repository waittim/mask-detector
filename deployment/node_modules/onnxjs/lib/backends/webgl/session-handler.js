"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebGLSessionHandler = void 0;
var instrument_1 = require("../../instrument");
var opset_1 = require("../../opset");
var inference_handler_1 = require("./inference-handler");
var op_resolve_rules_1 = require("./op-resolve-rules");
var program_manager_1 = require("./program-manager");
var texture_layout_strategy_1 = require("./texture-layout-strategy");
var texture_manager_1 = require("./texture-manager");
var WebGLSessionHandler = /** @class */ (function () {
    function WebGLSessionHandler(backend, context) {
        this.backend = backend;
        this.context = context;
        this.programManager = new program_manager_1.ProgramManager(this.context.profiler, backend.glContext);
        this.layoutStrategy = new texture_layout_strategy_1.AlwaysKeepOriginalSizeStrategy(backend.glContext.maxTextureSize);
        this.textureManager = new texture_manager_1.TextureManager(backend.glContext, this.layoutStrategy, this.context.profiler, { reuseTextures: backend.textureCacheMode === 'full' });
        this.textureDataCache = new Map();
    }
    WebGLSessionHandler.prototype.createInferenceHandler = function () {
        return new inference_handler_1.WebGLInferenceHandler(this);
    };
    WebGLSessionHandler.prototype.onGraphInitialized = function (graph) {
        var initializers = graph.getValues().filter(function (v) { return v.from === -1 && v.tensor; }).map(function (v) { return v.tensor.dataId; });
        this.initializers = new Set(initializers);
    };
    WebGLSessionHandler.prototype.isInitializer = function (tensorId) {
        return this.initializers ? this.initializers.has(tensorId) : false;
    };
    WebGLSessionHandler.prototype.getTextureData = function (tensorId) {
        return this.textureDataCache.get(tensorId);
    };
    WebGLSessionHandler.prototype.setTextureData = function (tensorId, textureData) {
        instrument_1.Logger.verbose('WebGLSessionHandler', 'Storing Texture data in cache');
        this.textureDataCache.set(tensorId, textureData);
    };
    WebGLSessionHandler.prototype.dispose = function () {
        var _this = this;
        this.programManager.dispose();
        this.textureManager.clearActiveTextures();
        this.textureDataCache.forEach(function (td) { return _this.textureManager.releaseTexture(td, true); });
        this.textureDataCache = new Map();
    };
    WebGLSessionHandler.prototype.resolve = function (node, opsets) {
        var op = opset_1.resolveOperator(node, opsets, op_resolve_rules_1.WEBGL_OP_RESOLVE_RULES);
        op.initialize(node.attributes);
        return op;
    };
    return WebGLSessionHandler;
}());
exports.WebGLSessionHandler = WebGLSessionHandler;
//# sourceMappingURL=session-handler.js.map