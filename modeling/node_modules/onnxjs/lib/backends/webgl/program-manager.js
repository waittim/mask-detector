"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramManager = void 0;
var env_1 = require("../../env");
var instrument_1 = require("../../instrument");
var glsl_preprocessor_1 = require("./glsl-preprocessor");
var glsl_source_1 = require("./glsl-source");
/**
 * ProgramManager is the main class behind running computations
 * It builds ProgramInfo's into Artifacts
 * It compiles given ProgramInfo's into WebGL Prorams (cached as Artifacts)
 * Uses the artifact to run the computation by calling Draw on
 * the WebGL drawing buffer
 * ProgramManager automatically maps (binds) input variables to their
 * corresponding Location's in the binary program
 */
var ProgramManager = /** @class */ (function () {
    function ProgramManager(profiler, glContext) {
        this.profiler = profiler;
        this.glContext = glContext;
        this.repo = new Map();
        this.attributesBound = false;
    }
    ProgramManager.prototype.getArtifact = function (key) {
        return this.repo.get(key);
    };
    ProgramManager.prototype.setArtifact = function (key, artifact) {
        this.repo.set(key, artifact);
    };
    ProgramManager.prototype.run = function (buildArtifact, runData) {
        var _this = this;
        this.profiler.event('backend', 'ProgramManager.run', function () {
            var gl = _this.glContext.gl;
            var program = buildArtifact.program;
            gl.useProgram(program);
            try {
                _this.bindOutput(runData.outputTextureData);
                if (!_this.attributesBound) {
                    _this.bindAttributes(buildArtifact.attribLocations);
                }
                _this.bindUniforms(buildArtifact.uniformLocations, runData.uniformData, runData.inputTextureDatas);
            }
            catch (err) {
                instrument_1.Logger.error('ProgramManager', buildArtifact.programInfo.shaderSource);
                throw err;
            }
            _this.profiler.event('backend', 'GlContext.draw()', function () {
                _this.doDraw(buildArtifact, runData);
                gl.flush();
            });
        });
    };
    ProgramManager.prototype.dispose = function () {
        var _this = this;
        if (this.vertexShader) {
            this.glContext.deleteShader(this.vertexShader);
        }
        this.repo.forEach(function (a) { return _this.glContext.deleteProgram(a.program); });
    };
    ProgramManager.prototype.build = function (programInfo) {
        var _this = this;
        return this.profiler.event('backend', 'ProgramManager.build', function () {
            var preprocessor = new glsl_preprocessor_1.GlslPreprocessor(_this.glContext, programInfo);
            var fragScript = preprocessor.preprocess();
            var program = _this.compile(fragScript);
            var artifact = {
                programInfo: programInfo,
                program: program,
                uniformLocations: _this.getUniformLocations(program, preprocessor.context.programInfo.samplers, preprocessor.context.programInfo.variables),
                attribLocations: _this.getAttribLocations(program)
            };
            return artifact;
        });
    };
    ProgramManager.prototype.doDraw = function (artifact, runData) {
        if (runData.draw) {
            instrument_1.Logger.verbose('ProgramManager', 'Custom draw function');
            runData.draw(this.glContext, artifact);
        }
        else {
            this.glContext.draw();
        }
    };
    ProgramManager.prototype.compile = function (fragShaderScript) {
        if (!this.vertexShader) {
            instrument_1.Logger.verbose('ProrgramManager', 'Compiling and caching Vertex shader for the first time');
            var vertexShaderScript = glsl_source_1.getVertexShaderSource(this.glContext.version);
            this.vertexShader = this.glContext.compileShader(vertexShaderScript, this.glContext.gl.VERTEX_SHADER);
        }
        if (env_1.env.debug) {
            instrument_1.Logger.verbose('ProrgramManager', "FragShader:\n" + fragShaderScript + "\n");
        }
        var fragShader = this.glContext.compileShader(fragShaderScript, this.glContext.gl.FRAGMENT_SHADER);
        var program = this.glContext.createProgram(this.vertexShader, fragShader);
        this.glContext.deleteShader(fragShader);
        return program;
    };
    ProgramManager.prototype.bindOutput = function (td) {
        instrument_1.Logger.verbose('ProrgramManager', "Binding output texture to Framebuffer: w/h=" + td.width + "/" + td.height + ", shape=" + td.shape + ", type=" + td.tensor.type);
        this.glContext.attachFramebuffer(td.texture, td.width, td.height);
    };
    ProgramManager.prototype.bindAttributes = function (attribLocations) {
        var positionHandle = attribLocations.position;
        var textureCoordHandle = attribLocations.textureCoord;
        this.glContext.setVertexAttributes(positionHandle, textureCoordHandle);
        this.attributesBound = true;
    };
    ProgramManager.prototype.bindUniforms = function (uniformLocations, uniformData, textures) {
        var e_1, _a;
        var gl = this.glContext.gl;
        var texturePosition = 0;
        try {
            for (var uniformLocations_1 = __values(uniformLocations), uniformLocations_1_1 = uniformLocations_1.next(); !uniformLocations_1_1.done; uniformLocations_1_1 = uniformLocations_1.next()) {
                var _b = uniformLocations_1_1.value, name_1 = _b.name, type = _b.type, location_1 = _b.location, arrayLength = _b.arrayLength;
                switch (type) {
                    case 'sampler2D':
                        this.bindTexture(textures[texturePosition], location_1, texturePosition);
                        texturePosition++;
                        break;
                    case 'float':
                        if (arrayLength) {
                            gl.uniform1fv(location_1, uniformData[name_1]);
                        }
                        else {
                            gl.uniform1f(location_1, uniformData[name_1]);
                        }
                        break;
                    case 'int':
                        if (arrayLength) {
                            gl.uniform1iv(location_1, uniformData[name_1]);
                        }
                        else {
                            gl.uniform1i(location_1, uniformData[name_1]);
                        }
                        break;
                    default:
                        throw new Error("Uniform not implemented: " + type);
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (uniformLocations_1_1 && !uniformLocations_1_1.done && (_a = uniformLocations_1.return)) _a.call(uniformLocations_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    ProgramManager.prototype.bindTexture = function (td, uniformHandle, position) {
        this.glContext.bindTextureToUniform(td.texture, position, uniformHandle);
    };
    ProgramManager.prototype.getAttribLocations = function (program) {
        return {
            position: this.getAttribLocation(program, 'position'),
            textureCoord: this.getAttribLocation(program, 'textureCoord')
        };
    };
    ProgramManager.prototype.getUniformLocations = function (program, samplers, variables) {
        var e_2, _a, e_3, _b;
        var uniformLocations = [];
        if (samplers) {
            try {
                for (var samplers_1 = __values(samplers), samplers_1_1 = samplers_1.next(); !samplers_1_1.done; samplers_1_1 = samplers_1.next()) {
                    var sampler = samplers_1_1.value;
                    uniformLocations.push({ name: sampler, type: 'sampler2D', location: this.getUniformLocation(program, sampler) });
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (samplers_1_1 && !samplers_1_1.done && (_a = samplers_1.return)) _a.call(samplers_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        if (variables) {
            try {
                for (var variables_1 = __values(variables), variables_1_1 = variables_1.next(); !variables_1_1.done; variables_1_1 = variables_1.next()) {
                    var variable = variables_1_1.value;
                    uniformLocations.push(__assign(__assign({}, variable), { location: this.getUniformLocation(program, variable.name) }));
                }
            }
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (variables_1_1 && !variables_1_1.done && (_b = variables_1.return)) _b.call(variables_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
        }
        return uniformLocations;
    };
    ProgramManager.prototype.getUniformLocation = function (program, name) {
        var gl = this.glContext.gl;
        var reference = gl.getUniformLocation(program, name);
        if (reference === null) {
            throw new Error("Uniform " + name + " not found.");
        }
        return reference;
    };
    ProgramManager.prototype.getAttribLocation = function (program, name) {
        var gl = this.glContext.gl;
        var attributeLocation = gl.getAttribLocation(program, name);
        return attributeLocation;
    };
    return ProgramManager;
}());
exports.ProgramManager = ProgramManager;
//# sourceMappingURL=program-manager.js.map