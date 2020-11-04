"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.glslTanh = exports.glslTan = exports.glslSqrt = exports.glslSigmoid = exports.glslRelu = exports.glslSin = exports.glslNot = exports.glslNeg = exports.glslLog = exports.glslIdentity = exports.glslFloor = exports.glslExp = exports.glslCos = exports.glslCeil = exports.glslAtan = exports.glslAsin = exports.glslAcos = exports.glslAbs = exports.WebGLUnaryOp = void 0;
var unary_op_1 = require("../../../ops/unary-op");
var glsl_definitions_1 = require("../glsl-definitions");
var glsl_source_1 = require("../glsl-source");
var WebGLUnaryOp = /** @class */ (function (_super) {
    __extends(WebGLUnaryOp, _super);
    function WebGLUnaryOp(typeConstraint, glslFunc) {
        var _this = _super.call(this, typeConstraint) || this;
        _this.typeConstraint = typeConstraint;
        _this.glslFunc = glslFunc;
        return _this;
    }
    WebGLUnaryOp.prototype.run = function (inferenceHandler, inputs) {
        return inferenceHandler.run(this, inputs);
    };
    WebGLUnaryOp.prototype.createProgramInfo = function (handler, inputs) {
        var outputShape = inputs[0].dims.slice();
        var inputLayout = handler.getOrCreateTextureLayout(inputs[0]);
        var glsl = glsl_source_1.getGlsl(handler.session.backend.glContext.version);
        var shaderSource = "\n      " + this.glslFunc.body + "\n      void main() {\n        vec4 v = " + glsl.texture2D + "(A, TexCoords);\n        v = " + this.glslFunc.name + "(v);\n        " + glsl.output + " = v;\n      }\n      ";
        var outputLayout = handler.createTextureLayoutFromShape(outputShape);
        return { inputLayouts: [inputLayout], outputLayout: outputLayout, samplers: ['A'], shaderSource: shaderSource, hasMain: true };
    };
    WebGLUnaryOp.prototype.createRunData = function (handler, programInfo, inputs) {
        var inputTDs = [handler.getOrCreateTextureData(inputs[0], programInfo.inputLayouts[0])];
        return {
            inputTextureDatas: inputTDs,
            outputTextureData: handler.createTextureDataFromLayout(programInfo.outputLayout, inputTDs[0].tensor.type),
            uniformData: {}
        };
    };
    return WebGLUnaryOp;
}(unary_op_1.UnaryOp));
exports.WebGLUnaryOp = WebGLUnaryOp;
function glslAbs() {
    return glslBuiltinUnary('abs');
}
exports.glslAbs = glslAbs;
function glslAcos() {
    return glslBuiltinUnary('acos');
}
exports.glslAcos = glslAcos;
function glslAsin() {
    return glslBuiltinUnary('asin');
}
exports.glslAsin = glslAsin;
function glslAtan() {
    return glslBuiltinUnary('atan');
}
exports.glslAtan = glslAtan;
function glslCeil() {
    return glslBuiltinUnary('ceil');
}
exports.glslCeil = glslCeil;
function glslCos() {
    return glslBuiltinUnary('cos');
}
exports.glslCos = glslCos;
function glslExp() {
    return glslBuiltinUnary('exp');
}
exports.glslExp = glslExp;
function glslFloor() {
    return glslBuiltinUnary('floor');
}
exports.glslFloor = glslFloor;
function glslIdentity() {
    var name = "indentity_";
    var body = "\n  float " + name + "(float a) {\n    return a;\n  }\n  vec4 " + name + "(vec4 v) {\n    return v;\n  }\n  ";
    return { body: body, name: name, type: glsl_definitions_1.FunctionType.ValueBased };
}
exports.glslIdentity = glslIdentity;
function glslLog() {
    return glslBuiltinUnary('log');
}
exports.glslLog = glslLog;
function glslNeg() {
    var name = "neg_";
    var body = "\n  float " + name + "(float a) {\n    return -a;\n  }\n  vec4 " + name + "(vec4 v) {\n    return -v;\n  }\n  ";
    return { body: body, name: name, type: glsl_definitions_1.FunctionType.ValueBased };
}
exports.glslNeg = glslNeg;
function glslNot() {
    var name = "not_";
    var body = "\n  float " + name + "(float a) {\n    return float( ! bool(a) );\n  }\n  bool " + name + "(bool a) {\n    return !a;\n  }\n  vec4 " + name + "(vec4 v) {\n    return vec4(!bool(v.x), !bool(v.y), !bool(v.z), !bool(v.w));\n  }\n  bvec4 " + name + "(bvec4 v) {\n    return bvec4(!v.x, !v.y, !v.z, !v.w);\n  }\n  ";
    return { body: body, name: name, type: glsl_definitions_1.FunctionType.ValueBased };
}
exports.glslNot = glslNot;
function glslSin() {
    return glslBuiltinUnary('sin');
}
exports.glslSin = glslSin;
function glslRelu() {
    var name = "relu_";
    var body = "\n  float " + name + "(float a) {\n    return max( a, 0.0 );\n  }\n  vec4 " + name + "(vec4 v) {\n    return max( v, 0.0 );\n  }\n  ";
    return { body: body, name: name, type: glsl_definitions_1.FunctionType.ValueBased };
}
exports.glslRelu = glslRelu;
function glslSigmoid() {
    var name = "sigmoid_";
    var body = "\n  float " + name + "(float a) {\n    return 1.0 / (1.0 + exp(-a));\n  }\n  vec4 " + name + "(vec4 v) {\n    return 1.0 / (1.0 + exp(-v));\n  }\n  ";
    return { body: body, name: name, type: glsl_definitions_1.FunctionType.ValueBased };
}
exports.glslSigmoid = glslSigmoid;
function glslSqrt() {
    return glslBuiltinUnary('sqrt');
}
exports.glslSqrt = glslSqrt;
function glslTan() {
    return glslBuiltinUnary('tan');
}
exports.glslTan = glslTan;
function glslTanh() {
    var name = "tanh_";
    var body = "\n  float " + name + "(float a) {\n    a = clamp(a, -10., 10.);\n    a = exp(2.*a);\n    return (a - 1.) / (a + 1.);\n  }\n  vec4 " + name + "(vec4 v) {\n    v = clamp(v, -10., 10.);\n    v = exp(2.*v);\n    return (v - 1.) / (v + 1.);\n  }\n  ";
    return { body: body, name: name, type: glsl_definitions_1.FunctionType.ValueBased };
}
exports.glslTanh = glslTanh;
function glslBuiltinUnary(fname) {
    var name = fname + "_";
    var body = "\n  float " + name + "(float a) {\n    return " + fname + "(a);\n  }\n  vec4 " + name + "(vec4 v) {\n    return " + fname + "(v);\n  }\n  ";
    return { body: body, name: name, type: glsl_definitions_1.FunctionType.ValueBased };
}
//# sourceMappingURL=unary-op.js.map