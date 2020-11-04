"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNewWebGLContext = exports.createWebGLContext = void 0;
var instrument_1 = require("../../instrument");
var webgl_context_1 = require("./webgl-context");
var cache = {};
/**
 * This factory function creates proper WebGLRenderingContext based on
 * the current browsers capabilities
 * The order is from higher/most recent versions to most basic
 */
function createWebGLContext(contextId) {
    var context;
    if ((!contextId || contextId === 'webgl2') && 'webgl2' in cache) {
        context = cache.webgl2;
    }
    else if ((!contextId || contextId === 'webgl') && 'webgl' in cache) {
        context = cache.webgl;
    }
    context = context || createNewWebGLContext(contextId);
    contextId = contextId || context.version === 1 ? 'webgl' : 'webgl2';
    var gl = context.gl;
    cache[contextId] = context;
    if (gl.isContextLost()) {
        delete cache[contextId];
        return createWebGLContext(contextId);
    }
    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.STENCIL_TEST);
    gl.disable(gl.BLEND);
    gl.disable(gl.DITHER);
    gl.disable(gl.POLYGON_OFFSET_FILL);
    gl.disable(gl.SAMPLE_COVERAGE);
    gl.enable(gl.SCISSOR_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    return context;
}
exports.createWebGLContext = createWebGLContext;
function createNewWebGLContext(contextId) {
    var canvas = createCanvas();
    var contextAttributes = {
        alpha: false,
        depth: false,
        antialias: false,
        stencil: false,
        preserveDrawingBuffer: false,
        premultipliedAlpha: false,
        failIfMajorPerformanceCaveat: false
    };
    var gl;
    var ca = contextAttributes;
    if (!contextId || contextId === 'webgl2') {
        gl = canvas.getContext('webgl2', ca);
        if (gl) {
            try {
                return new webgl_context_1.WebGLContext(gl, 2);
            }
            catch (err) {
                instrument_1.Logger.warning('GlContextFactory', "failed to create WebGLContext using contextId 'webgl2'. Error: " + err);
            }
        }
    }
    if (!contextId || contextId === 'webgl') {
        gl = canvas.getContext('webgl', ca) || canvas.getContext('experimental-webgl', ca);
        if (gl) {
            try {
                return new webgl_context_1.WebGLContext(gl, 1);
            }
            catch (err) {
                instrument_1.Logger.warning('GlContextFactory', "failed to create WebGLContext using contextId 'webgl' or 'experimental-webgl'. Error: " + err);
            }
        }
    }
    throw new Error('WebGL is not supported');
}
exports.createNewWebGLContext = createNewWebGLContext;
function createCanvas() {
    var canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas;
}
//# sourceMappingURL=webgl-context-factory.js.map