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
exports.glslPRelu = exports.glslPow = exports.glslXor = exports.glslOr = exports.glslAnd = exports.glslLess = exports.glslGreater = exports.glslEqual = exports.glslSub = exports.glslMul = exports.glslDiv = exports.glslAdd = exports.WebGLBinaryOp = void 0;
var binary_op_1 = require("../../../ops/binary-op");
var util_1 = require("../../../util");
var glsl_definitions_1 = require("../glsl-definitions");
var glsl_source_1 = require("../glsl-source");
var WebGLBinaryOp = /** @class */ (function (_super) {
    __extends(WebGLBinaryOp, _super);
    function WebGLBinaryOp(typeConstraint, glslFunc, opType, resultType) {
        var _this = _super.call(this, typeConstraint, opType, resultType) || this;
        _this.glslFunc = glslFunc;
        return _this;
    }
    WebGLBinaryOp.prototype.run = function (inferenceHandler, inputs) {
        return inferenceHandler.run(this, inputs);
    };
    WebGLBinaryOp.prototype.createProgramInfo = function (handler, inputs) {
        var inputLayouts = inputs.map(function (t) { return handler.getOrCreateTextureLayout(t); });
        var isBroadcast = !util_1.ShapeUtil.areEqual(inputs[0].dims, inputs[1].dims);
        if (isBroadcast) {
            var outputShape = util_1.BroadcastUtil.calcShape(inputs[0].dims, inputs[1].dims, false);
            if (!outputShape) {
                throw new Error("Can't perform binary op on the given tensors");
            }
            var outputRank = outputShape.length;
            var aRank = inputs[0].dims.length !== 0 ? inputs[0].dims.length : 1;
            var bRank = inputs[1].dims.length !== 0 ? inputs[1].dims.length : 1;
            var aBcast = inputs[0].dims.length !== 0 ? "bcastIndices_A(indices, aindices);" : "aindices[0] = 0;";
            var bBcast = inputs[1].dims.length !== 0 ? "bcastIndices_B(indices, bindices);" : "bindices[0] = 0;";
            var shaderSource_1 = "\n      " + this.glslFunc.body + "\n      float process(int indices[" + outputRank + "]) {\n        int aindices[" + aRank + "];\n        int bindices[" + bRank + "];\n        " + aBcast + "\n        " + bBcast + "\n        return " + this.glslFunc.name + "(_A(aindices), _B(bindices));\n    }";
            return {
                inputLayouts: inputLayouts,
                outputLayout: handler.createTextureLayoutFromShape(outputShape),
                samplers: ['A', 'B'],
                shaderSource: shaderSource_1,
            };
        }
        var glsl = glsl_source_1.getGlsl(handler.session.backend.glContext.version);
        var shaderSource = "\n    " + this.glslFunc.body + "\n    void main() {\n      vec4 v1 = " + glsl.texture2D + "(A, TexCoords);\n      vec4 v2 = " + glsl.texture2D + "(B, TexCoords);\n      vec4 result = " + this.glslFunc.name + "(v1, v2);\n      " + glsl.output + " = result;\n    }\n    ";
        return {
            hasMain: true,
            inputLayouts: inputLayouts,
            outputLayout: handler.createTextureLayoutFromShape(inputs[0].dims),
            samplers: ['A', 'B'],
            shaderSource: shaderSource,
        };
    };
    WebGLBinaryOp.prototype.createRunData = function (handler, programInfo, inputs) {
        var inputTDs = inputs.map(function (t, i) { return handler.getOrCreateTextureData(t, programInfo.inputLayouts[i]); });
        return {
            inputTextureDatas: inputTDs,
            outputTextureData: handler.createTextureDataFromLayout(programInfo.outputLayout, this.resultType ? this.resultType : inputs[0].type),
            uniformData: {}
        };
    };
    return WebGLBinaryOp;
}(binary_op_1.BinaryOp));
exports.WebGLBinaryOp = WebGLBinaryOp;
function glslAdd() {
    var name = "add_";
    var body = "\n  float " + name + "(float a, float b) {\n    return a + b;\n  }\n  vec4 " + name + "(vec4 v1, vec4 v2) {\n    return v1 + v2;\n  }\n  ";
    return { body: body, name: name, type: glsl_definitions_1.FunctionType.ValueBased };
}
exports.glslAdd = glslAdd;
function glslDiv() {
    var name = "div_";
    var body = "\n  float " + name + "(float a, float b) {\n    return a / b;\n  }\n  vec4 " + name + "(vec4 v1, vec4 v2) {\n    return v1 / v2;\n  }\n  ";
    return { body: body, name: name, type: glsl_definitions_1.FunctionType.ValueBased };
}
exports.glslDiv = glslDiv;
function glslMul() {
    var name = "mul_";
    var body = "\n  float " + name + "(float a, float b) {\n    return a * b;\n  }\n  vec4 " + name + "(vec4 v1, vec4 v2) {\n    return v1 * v2;\n  }\n  ";
    return { body: body, name: name, type: glsl_definitions_1.FunctionType.ValueBased };
}
exports.glslMul = glslMul;
function glslSub() {
    var name = "sub_";
    var body = "\n  float " + name + "(float a, float b) {\n    return a - b;\n  }\n  vec4 " + name + "(vec4 v1, vec4 v2) {\n    return v1 - v2;\n  }\n  ";
    return { body: body, name: name, type: glsl_definitions_1.FunctionType.ValueBased };
}
exports.glslSub = glslSub;
function glslEqual() {
    var name = "equal_";
    var body = "\n  float " + name + "(float a, float b) {\n    return float(a == b);\n  }\n  vec4 " + name + "(vec4 v1, vec4 v2) {\n    return vec4( v1 == v2 );\n  }\n  ";
    return { body: body, name: name, type: glsl_definitions_1.FunctionType.ValueBased };
}
exports.glslEqual = glslEqual;
function glslGreater() {
    var name = "greater_";
    var body = "\n  float " + name + "(float a, float b) {\n    return float(a > b);\n  }\n  vec4 " + name + "(vec4 v1, vec4 v2) {\n    return vec4( v1.r > v2.r ,\n      v1.g > v2.g,\n      v1.b > v2.b,\n      v1.a > v2.a );\n  }\n  ";
    return { body: body, name: name, type: glsl_definitions_1.FunctionType.ValueBased };
}
exports.glslGreater = glslGreater;
function glslLess() {
    var name = "less_";
    var body = "\n  float " + name + "(float a, float b) {\n    return float(a < b);\n  }\n  vec4 " + name + "(vec4 v1, vec4 v2) {\n    return vec4( v1.r < v2.r ,\n                v1.g < v2.g,\n                v1.b < v2.b,\n                v1.a < v2.a );\n  }\n  ";
    return { body: body, name: name, type: glsl_definitions_1.FunctionType.ValueBased };
}
exports.glslLess = glslLess;
function glslAnd() {
    var name = "and_";
    var body = "\n  float " + name + "(float a, float b) {\n    return float( bool(a) && bool(b) );\n  }\n  vec4 " + name + "(vec4 v1, vec4 v2) {\n    bvec4 b1 = bvec4(v1);\n    bvec4 b2 = bvec4(v2);\n    return vec4( b1.r && b2.r ,\n                b1.g && b2.g,\n                b1.b && b2.b,\n                b1.a && b2.a );\n  }\n  ";
    return { body: body, name: name, type: glsl_definitions_1.FunctionType.ValueBased };
}
exports.glslAnd = glslAnd;
function glslOr() {
    var name = "or_";
    var body = "\n  float " + name + "(float a, float b) {\n    return float( bool(a) || bool(b) );\n  }\n  vec4 " + name + "(vec4 v1, vec4 v2) {\n    bvec4 b1 = bvec4(v1);\n    bvec4 b2 = bvec4(v2);\n    return vec4( b1.r || b2.r ,\n                b1.g || b2.g,\n                b1.b || b2.b,\n                b1.a || b2.a );\n  }\n  ";
    return { body: body, name: name, type: glsl_definitions_1.FunctionType.ValueBased };
}
exports.glslOr = glslOr;
function glslXor() {
    var name = "xor_";
    var body = "\n  float " + name + "(float a, float b) {\n    return float( bool(a) ^^ bool(b) );\n  }\n  vec4 " + name + "(vec4 v1, vec4 v2) {\n    bvec4 b1 = bvec4(v1);\n    bvec4 b2 = bvec4(v2);\n    return vec4( b1.r ^^ b2.r ,\n                b1.g ^^ b2.g,\n                b1.b ^^ b2.b,\n                b1.a ^^ b2.a );\n  }\n  ";
    return { body: body, name: name, type: glsl_definitions_1.FunctionType.ValueBased };
}
exports.glslXor = glslXor;
function glslPow() {
    return glslBuiltinBinary('pow');
}
exports.glslPow = glslPow;
function glslPRelu() {
    var name = "prelu_";
    var body = "\n  float " + name + "(float a, float b) {\n    return a < 0.0 ? a * b: a;\n  }\n  vec4 " + name + "(vec4 v1, vec4 v2) {\n    return vec4(\n      v1.r < 0.0 ? v1.r * v2.r: v1.r,\n      v1.g < 0.0 ? v1.g * v2.g: v1.g,\n      v1.b < 0.0 ? v1.b * v2.b: v1.b,\n      v1.a < 0.0 ? v1.a * v2.a: v1.a\n      );\n  }\n  ";
    return { body: body, name: name, type: glsl_definitions_1.FunctionType.ValueBased };
}
exports.glslPRelu = glslPRelu;
function glslBuiltinBinary(fname) {
    var name = fname + "_";
    var body = "\n  float " + name + "(float a, float b) {\n    return " + fname + "(a, b);\n  }\n  vec4 " + name + "(vec4 v1, vec4 v2) {\n    return " + fname + "(v1, v2);\n  }\n  ";
    return { body: body, name: name, type: glsl_definitions_1.FunctionType.ValueBased };
}
//# sourceMappingURL=binary-op.js.map