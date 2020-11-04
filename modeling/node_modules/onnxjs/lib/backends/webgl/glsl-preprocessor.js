"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
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
exports.GlslPreprocessor = void 0;
var glsl_definitions_1 = require("./glsl-definitions");
var glsl_function_inliner_1 = require("./glsl-function-inliner");
var glsl_registered_libs_1 = require("./glsl-registered-libs");
var glsl_source_1 = require("./glsl-source");
/**
 * Preprocessor for the additions to the GLSL language
 * It deals with:
 *  @include directives
 *  @inline
 *  Loop unrolling (not implemented)
 *  Macro resolution (not implemented)
 */
var GlslPreprocessor = /** @class */ (function () {
    function GlslPreprocessor(glContext, programInfo) {
        var _this = this;
        this.libs = {};
        this.glslLibRoutineDependencyGraph = {};
        this.context = new glsl_definitions_1.GlslContext(glContext, programInfo);
        // construct GlslLibs
        Object.keys(glsl_registered_libs_1.glslRegistry).forEach(function (name) {
            var lib = new glsl_registered_libs_1.glslRegistry[name](_this.context);
            _this.libs[name] = lib;
        });
        // construct GlslRoutineDependencyGraph
        var map = this.glslLibRoutineDependencyGraph;
        for (var libName in this.libs) {
            var lib = this.libs[libName];
            var routinesInLib = lib.getFunctions();
            for (var routine in routinesInLib) {
                var key = libName + '.' + routine;
                var currentNode = void 0;
                if (map[key]) {
                    currentNode = map[key];
                    currentNode.routineBody = routinesInLib[routine].routineBody;
                }
                else {
                    currentNode = new glsl_definitions_1.GlslLibRoutineNode(key, routinesInLib[routine].routineBody);
                    map[key] = currentNode;
                }
                var dependencies = routinesInLib[routine].dependencies;
                if (dependencies) {
                    for (var i = 0; i < dependencies.length; ++i) {
                        if (!map[dependencies[i]]) {
                            var node = new glsl_definitions_1.GlslLibRoutineNode(dependencies[i]);
                            map[dependencies[i]] = node;
                            currentNode.addDependency(node);
                        }
                        else {
                            currentNode.addDependency(map[dependencies[i]]);
                        }
                    }
                }
            }
        }
    }
    GlslPreprocessor.prototype.preprocess = function () {
        var programInfo = this.context.programInfo;
        var source = programInfo.shaderSource;
        // append main() function
        if (!this.context.programInfo.hasMain) {
            source = source + "\n      " + glsl_source_1.getDefaultFragShaderMain(this.context.glContext.version, programInfo.outputLayout.shape.length);
        }
        // replace inlines
        source = glsl_function_inliner_1.replaceInlines(source);
        // concat final source string
        return glsl_source_1.getFragShaderPreamble(this.context.glContext.version) + "\n    " + this.getUniforms(programInfo.samplers, programInfo.variables) + "\n    " + this.getImports(source) + "\n    " + source;
    };
    GlslPreprocessor.prototype.getImports = function (script) {
        var routinesIncluded = this.selectGlslLibRoutinesToBeIncluded(script);
        if (routinesIncluded.length === 0) {
            return '';
        }
        var routines = "";
        for (var i = 0; i < routinesIncluded.length; ++i) {
            if (routinesIncluded[i].routineBody) {
                routines += routinesIncluded[i].routineBody + "\n";
            }
            else {
                throw new Error("Missing body for the Glsl Library routine: " + routinesIncluded[i].name);
            }
        }
        return routines;
    };
    GlslPreprocessor.prototype.selectGlslLibRoutinesToBeIncluded = function (script) {
        var _this = this;
        var nodes = [];
        Object.keys(this.glslLibRoutineDependencyGraph).forEach(function (classAndRoutine) {
            var routine = classAndRoutine.split('.')[1];
            if (script.indexOf(routine) !== -1) {
                nodes.push(_this.glslLibRoutineDependencyGraph[classAndRoutine]);
            }
        });
        return glsl_definitions_1.TopologicalSortGlslRoutines.returnOrderedNodes(nodes);
    };
    GlslPreprocessor.prototype.getUniforms = function (samplers, variables) {
        var e_1, _a, e_2, _b;
        var uniformLines = [];
        if (samplers) {
            try {
                for (var samplers_1 = __values(samplers), samplers_1_1 = samplers_1.next(); !samplers_1_1.done; samplers_1_1 = samplers_1.next()) {
                    var sampler = samplers_1_1.value;
                    uniformLines.push("uniform sampler2D " + sampler + ";");
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (samplers_1_1 && !samplers_1_1.done && (_a = samplers_1.return)) _a.call(samplers_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
        if (variables) {
            try {
                for (var variables_1 = __values(variables), variables_1_1 = variables_1.next(); !variables_1_1.done; variables_1_1 = variables_1.next()) {
                    var variable = variables_1_1.value;
                    uniformLines.push("uniform " + variable.type + " " + variable.name + (variable.arrayLength ? "[" + variable.arrayLength + "]" : '') + ";");
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (variables_1_1 && !variables_1_1.done && (_b = variables_1.return)) _b.call(variables_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
        return uniformLines.join('\n');
    };
    return GlslPreprocessor;
}());
exports.GlslPreprocessor = GlslPreprocessor;
//# sourceMappingURL=glsl-preprocessor.js.map