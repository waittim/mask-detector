"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultFragShaderMain = exports.getFragShaderPreamble = exports.getVertexShaderSource = exports.getGlsl = void 0;
var GLSL_ES_2_0 = {
    version: '',
    attribute: 'attribute',
    varyingVertex: 'varying',
    varyingFrag: 'varying',
    texture2D: 'texture2D',
    output: 'gl_FragColor',
    outputDeclaration: '',
};
var GLSL_ES_3_0 = {
    version: '#version 300 es',
    attribute: 'in',
    varyingVertex: 'out',
    varyingFrag: 'in',
    texture2D: 'texture',
    output: 'outputColor',
    outputDeclaration: 'out vec4 outputColor;',
};
function getGlsl(version) {
    return version === 1 ? GLSL_ES_2_0 : GLSL_ES_3_0;
}
exports.getGlsl = getGlsl;
function getVertexShaderSource(version) {
    var glsl = getGlsl(version);
    return glsl.version + "\n      precision highp float;\n      " + glsl.attribute + " vec3 position;\n      " + glsl.attribute + " vec2 textureCoord;\n\n      " + glsl.varyingVertex + " vec2 TexCoords;\n\n      void main()\n      {\n          gl_Position = vec4(position, 1.0);\n          TexCoords = textureCoord;\n      }";
}
exports.getVertexShaderSource = getVertexShaderSource;
function getFragShaderPreamble(version) {
    var glsl = getGlsl(version);
    return glsl.version + "\n    precision highp float;\n    precision highp int;\n    precision highp sampler2D;\n    " + glsl.varyingFrag + " vec2 TexCoords;\n    " + glsl.outputDeclaration + "\n\n    ";
}
exports.getFragShaderPreamble = getFragShaderPreamble;
function getDefaultFragShaderMain(version, outputShapeLength) {
    var glsl = getGlsl(version);
    return "\n  void main() {\n    int indices[" + outputShapeLength + "];\n    toVec(TexCoords, indices);\n    vec4 result = vec4(process(indices));\n    " + glsl.output + " = result;\n  }\n  ";
}
exports.getDefaultFragShaderMain = getDefaultFragShaderMain;
//# sourceMappingURL=glsl-source.js.map