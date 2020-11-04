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
exports.WebGLContext = void 0;
var env_1 = require("../../env");
var DataEncoders = __importStar(require("./texture-data-encoder"));
/**
 * Abstraction and wrapper around WebGLRenderingContext and its operations
 */
var WebGLContext = /** @class */ (function () {
    function WebGLContext(gl, version) {
        this.frameBufferBound = false;
        this.gl = gl;
        this.version = version;
        this.getExtensions();
        this.vertexbuffer = this.createVertexbuffer();
        this.framebuffer = this.createFramebuffer();
        this.queryVitalParameters();
    }
    WebGLContext.prototype.allocateTexture = function (width, height, encoder, data) {
        var gl = this.gl;
        // create the texture
        var texture = gl.createTexture();
        // bind the texture so the following methods effect this texture.
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        var buffer = data ? encoder.encode(data, width * height) : null;
        gl.texImage2D(gl.TEXTURE_2D, 0, // Level of detail.
        encoder.internalFormat, width, height, 0, // Always 0 in OpenGL ES.
        encoder.format, encoder.textureType, buffer);
        this.checkError();
        return texture;
    };
    WebGLContext.prototype.updateTexture = function (texture, width, height, encoder, data) {
        var gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        var buffer = encoder.encode(data, width * height);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, // level
        0, // xoffset
        0, // yoffset
        width, height, encoder.format, encoder.textureType, buffer);
        this.checkError();
    };
    WebGLContext.prototype.attachFramebuffer = function (texture, width, height) {
        var gl = this.gl;
        // Make it the target for framebuffer operations - including rendering.
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0); // 0, we aren't using MIPMAPs
        this.checkError();
        gl.viewport(0, 0, width, height);
        gl.scissor(0, 0, width, height);
    };
    WebGLContext.prototype.readTexture = function (texture, width, height, dataSize, dataType, channels) {
        var gl = this.gl;
        if (!channels) {
            channels = 1;
        }
        if (!this.frameBufferBound) {
            this.attachFramebuffer(texture, width, height);
        }
        var encoder = this.getEncoder(dataType, channels);
        var buffer = encoder.allocate(width * height);
        // bind texture to framebuffer
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0); // 0, we aren't using MIPMAPs
        // TODO: Check if framebuffer is ready
        gl.readPixels(0, 0, width, height, gl.RGBA, encoder.textureType, buffer);
        this.checkError();
        // unbind FB
        return encoder.decode(buffer, dataSize);
    };
    WebGLContext.prototype.isFramebufferReady = function () {
        // TODO: Implement logic to check if the framebuffer is ready
        return true;
    };
    WebGLContext.prototype.getActiveTexture = function () {
        var gl = this.gl;
        var n = gl.getParameter(this.gl.ACTIVE_TEXTURE);
        return "TEXTURE" + (n - gl.TEXTURE0);
    };
    WebGLContext.prototype.getTextureBinding = function () {
        return this.gl.getParameter(this.gl.TEXTURE_BINDING_2D);
    };
    WebGLContext.prototype.getFramebufferBinding = function () {
        return this.gl.getParameter(this.gl.FRAMEBUFFER_BINDING);
    };
    WebGLContext.prototype.setVertexAttributes = function (positionHandle, textureCoordHandle) {
        var gl = this.gl;
        gl.vertexAttribPointer(positionHandle, 3, gl.FLOAT, false, 20, 0);
        gl.enableVertexAttribArray(positionHandle);
        if (textureCoordHandle !== -1) {
            gl.vertexAttribPointer(textureCoordHandle, 2, gl.FLOAT, false, 20, 12);
            gl.enableVertexAttribArray(textureCoordHandle);
        }
        this.checkError();
    };
    WebGLContext.prototype.createProgram = function (vertexShader, fragShader) {
        var gl = this.gl;
        var program = gl.createProgram();
        // the program consists of our shaders
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragShader);
        gl.linkProgram(program);
        return program;
    };
    WebGLContext.prototype.compileShader = function (shaderSource, shaderType) {
        var gl = this.gl;
        var shader = gl.createShader(shaderType);
        if (!shader) {
            throw new Error("createShader() returned null with type " + shaderType);
        }
        gl.shaderSource(shader, shaderSource);
        gl.compileShader(shader);
        if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) === false) {
            throw new Error("Failed to compile shader: " + gl.getShaderInfoLog(shader));
        }
        return shader;
    };
    WebGLContext.prototype.deleteShader = function (shader) {
        this.gl.deleteShader(shader);
    };
    WebGLContext.prototype.bindTextureToUniform = function (texture, position, uniformHandle) {
        var gl = this.gl;
        gl.activeTexture(gl.TEXTURE0 + position);
        this.checkError();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        this.checkError();
        gl.uniform1i(uniformHandle, position);
        this.checkError();
    };
    WebGLContext.prototype.draw = function () {
        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        this.checkError();
    };
    WebGLContext.prototype.checkError = function () {
        if (env_1.env.debug) {
            var gl = this.gl;
            var error = gl.getError();
            var label = '';
            switch (error) {
                case (gl.NO_ERROR):
                    return;
                case (gl.INVALID_ENUM):
                    label = 'INVALID_ENUM';
                    break;
                case (gl.INVALID_VALUE):
                    label = 'INVALID_VALUE';
                    break;
                case (gl.INVALID_OPERATION):
                    label = 'INVALID_OPERATION';
                    break;
                case (gl.INVALID_FRAMEBUFFER_OPERATION):
                    label = 'INVALID_FRAMEBUFFER_OPERATION';
                    break;
                case (gl.OUT_OF_MEMORY):
                    label = 'OUT_OF_MEMORY';
                    break;
                case (gl.CONTEXT_LOST_WEBGL):
                    label = 'CONTEXT_LOST_WEBGL';
                    break;
                default:
                    label = 'Unknown WebGL Error: ' + error.toString(16);
            }
            throw new Error(label);
        }
    };
    WebGLContext.prototype.deleteTexture = function (texture) {
        this.gl.deleteTexture(texture);
    };
    WebGLContext.prototype.deleteProgram = function (program) {
        this.gl.deleteProgram(program);
    };
    WebGLContext.prototype.getEncoder = function (dataType, channels, usage) {
        if (usage === void 0) { usage = 0 /* Default */; }
        if (this.version === 2) {
            return new DataEncoders.RedFloat32DataEncoder(this.gl, channels);
        }
        switch (dataType) {
            case 'float':
                if (usage === 1 /* UploadOnly */ || this.isRenderFloat32Supported) {
                    return new DataEncoders.RGBAFloatDataEncoder(this.gl, channels);
                }
                else {
                    return new DataEncoders.RGBAFloatDataEncoder(this.gl, channels, this.textureHalfFloatExtension.HALF_FLOAT_OES);
                }
            case 'int':
                throw new Error('not implemented');
            case 'byte':
                return new DataEncoders.Uint8DataEncoder(this.gl, channels);
            default:
                throw new Error("Invalid dataType: " + dataType);
        }
    };
    WebGLContext.prototype.clearActiveTextures = function () {
        var gl = this.gl;
        for (var unit = 0; unit < this.maxTextureImageUnits; ++unit) {
            gl.activeTexture(gl.TEXTURE0 + unit);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
    };
    WebGLContext.prototype.dispose = function () {
        if (this.disposed) {
            return;
        }
        var gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.deleteFramebuffer(this.framebuffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.deleteBuffer(this.vertexbuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.finish();
        this.disposed = true;
    };
    WebGLContext.prototype.createDefaultGeometry = function () {
        // Sets of x,y,z(=0),s,t coordinates.
        return new Float32Array([
            -1.0, 1.0, 0.0, 0.0, 1.0,
            -1.0, -1.0, 0.0, 0.0, 0.0,
            1.0, 1.0, 0.0, 1.0, 1.0,
            1.0, -1.0, 0.0, 1.0, 0.0
        ]); // lower right
    };
    WebGLContext.prototype.createVertexbuffer = function () {
        var gl = this.gl;
        var buffer = gl.createBuffer();
        if (!buffer) {
            throw new Error('createBuffer() returned null');
        }
        var geometry = this.createDefaultGeometry();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, geometry, gl.STATIC_DRAW);
        this.checkError();
        return buffer;
    };
    WebGLContext.prototype.createFramebuffer = function () {
        var fb = this.gl.createFramebuffer();
        if (!fb) {
            throw new Error('createFramebuffer returned null');
        }
        return fb;
    };
    WebGLContext.prototype.queryVitalParameters = function () {
        var gl = this.gl;
        this.isFloatTextureAttachableToFrameBuffer = this.checkFloatTextureAttachableToFrameBuffer();
        this.isRenderFloat32Supported = this.checkRenderFloat32();
        this.isFloat32DownloadSupported = this.checkFloat32Download();
        if (this.version === 1 && !this.textureHalfFloatExtension && !this.isRenderFloat32Supported) {
            throw new Error("both float32 and float16 TextureType are not supported");
        }
        this.isBlendSupported = !this.isRenderFloat32Supported || this.checkFloat32Blend();
        // this.maxCombinedTextureImageUnits = gl.getParameter(gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS);
        this.maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        this.maxTextureImageUnits = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
        // this.maxCubeMapTextureSize = gl.getParameter(gl.MAX_CUBE_MAP_TEXTURE_SIZE);
        // this.shadingLanguageVersion = gl.getParameter(gl.SHADING_LANGUAGE_VERSION);
        // this.webglVendor = gl.getParameter(gl.VENDOR);
        // this.webglVersion = gl.getParameter(gl.VERSION);
        if (this.version === 2) {
            // this.max3DTextureSize = gl.getParameter(WebGL2RenderingContext.MAX_3D_TEXTURE_SIZE);
            // this.maxArrayTextureLayers = gl.getParameter(WebGL2RenderingContext.MAX_ARRAY_TEXTURE_LAYERS);
            // this.maxColorAttachments = gl.getParameter(WebGL2RenderingContext.MAX_COLOR_ATTACHMENTS);
            // this.maxDrawBuffers = gl.getParameter(WebGL2RenderingContext.MAX_DRAW_BUFFERS);
        }
    };
    WebGLContext.prototype.getExtensions = function () {
        if (this.version === 2) {
            this.colorBufferFloatExtension = this.gl.getExtension('EXT_color_buffer_float');
        }
        else {
            this.textureFloatExtension = this.gl.getExtension('OES_texture_float');
            this.textureHalfFloatExtension = this.gl.getExtension('OES_texture_half_float');
        }
    };
    WebGLContext.prototype.checkFloatTextureAttachableToFrameBuffer = function () {
        // test whether Float32 texture is supported:
        // STEP.1 create a float texture
        var gl = this.gl;
        var texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        var internalFormat = this.version === 2 ? gl.RGBA32F : gl.RGBA;
        gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 1, 1, 0, gl.RGBA, gl.FLOAT, null);
        // STEP.2 bind a frame buffer
        var frameBuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
        // STEP.3 attach texture to framebuffer
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
        // STEP.4 test whether framebuffer is complete
        var isComplete = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.deleteTexture(texture);
        gl.deleteFramebuffer(frameBuffer);
        return isComplete;
    };
    WebGLContext.prototype.checkRenderFloat32 = function () {
        if (this.version === 2) {
            if (!this.colorBufferFloatExtension) {
                return false;
            }
        }
        else {
            if (!this.textureFloatExtension) {
                return false;
            }
        }
        return this.isFloatTextureAttachableToFrameBuffer;
    };
    WebGLContext.prototype.checkFloat32Download = function () {
        if (this.version === 2) {
            if (!this.colorBufferFloatExtension) {
                return false;
            }
        }
        else {
            if (!this.textureFloatExtension) {
                return false;
            }
            if (!this.gl.getExtension('WEBGL_color_buffer_float')) {
                return false;
            }
        }
        return this.isFloatTextureAttachableToFrameBuffer;
    };
    /**
     * Check whether GL_BLEND is supported
     */
    WebGLContext.prototype.checkFloat32Blend = function () {
        // it looks like currently (2019-05-08) there is no easy way to detect whether BLEND is supported
        // https://github.com/microsoft/onnxjs/issues/145
        var gl = this.gl;
        var texture;
        var frameBuffer;
        var vertexShader;
        var fragmentShader;
        var program;
        try {
            texture = gl.createTexture();
            frameBuffer = gl.createFramebuffer();
            gl.bindTexture(gl.TEXTURE_2D, texture);
            var internalFormat = this.version === 2 ? gl.RGBA32F : gl.RGBA;
            gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 1, 1, 0, gl.RGBA, gl.FLOAT, null);
            gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
            gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
            gl.enable(gl.BLEND);
            vertexShader = gl.createShader(gl.VERTEX_SHADER);
            if (!vertexShader) {
                return false;
            }
            gl.shaderSource(vertexShader, 'void main(){}');
            gl.compileShader(vertexShader);
            fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
            if (!fragmentShader) {
                return false;
            }
            gl.shaderSource(fragmentShader, "precision highp float;void main(){gl_FragColor=vec4(0.5);}");
            gl.compileShader(fragmentShader);
            program = gl.createProgram();
            if (!program) {
                return false;
            }
            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);
            gl.useProgram(program);
            gl.drawArrays(gl.POINTS, 0, 1);
            return gl.getError() === gl.NO_ERROR;
        }
        finally {
            gl.disable(gl.BLEND);
            if (program) {
                gl.deleteProgram(program);
            }
            if (vertexShader) {
                gl.deleteShader(vertexShader);
            }
            if (fragmentShader) {
                gl.deleteShader(fragmentShader);
            }
            if (frameBuffer) {
                gl.bindFramebuffer(gl.FRAMEBUFFER, null);
                gl.deleteFramebuffer(frameBuffer);
            }
            if (texture) {
                gl.bindTexture(gl.TEXTURE_2D, null);
                gl.deleteTexture(texture);
            }
        }
    };
    return WebGLContext;
}());
exports.WebGLContext = WebGLContext;
//# sourceMappingURL=webgl-context.js.map