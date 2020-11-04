"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.replaceInlines = void 0;
var INLINE_FUNC_DEF_REGEX = /@inline[\s\n\r]+(\w+)[\s\n\r]+([0-9a-zA-Z_]+)\s*\(([^)]*)\)\s*{(([^}]|[\n\r])*)}/gm;
var FUNC_CALL_REGEX = '(\\w+)?\\s+([_0-9a-zA-Z]+)\\s+=\\s+__FUNC__\\((.*)\\)\\s*;';
/**
 * GLSL preprocessor responsible for resolving @inline directives
 */
function replaceInlines(script) {
    var inlineDefs = {};
    var match;
    while ((match = INLINE_FUNC_DEF_REGEX.exec(script)) !== null) {
        var params = match[3]
            .split(',')
            .map(function (s) {
            var tokens = s.trim().split(' ');
            if (tokens && tokens.length === 2) {
                return { type: tokens[0], name: tokens[1] };
            }
            return null;
        })
            .filter(function (v) { return v !== null; });
        inlineDefs[match[2]] = { params: params, body: match[4] };
    }
    for (var name_1 in inlineDefs) {
        var regexString = FUNC_CALL_REGEX.replace('__FUNC__', name_1);
        var regex = new RegExp(regexString, 'gm');
        var _loop_1 = function () {
            var type = match[1];
            var variable = match[2];
            var params = match[3].split(',');
            var declLine = (type) ? type + " " + variable + ";" : '';
            var newBody = inlineDefs[name_1].body;
            var paramRedecLine = '';
            inlineDefs[name_1].params.forEach(function (v, i) {
                if (v) {
                    paramRedecLine += v.type + " " + v.name + " = " + params[i] + ";\n";
                }
            });
            newBody = paramRedecLine + "\n " + newBody;
            newBody = newBody.replace('return', variable + " = ");
            var replacement = "\n      " + declLine + "\n      {\n        " + newBody + "\n      }\n      ";
            script = script.replace(match[0], replacement);
        };
        while ((match = regex.exec(script)) !== null) {
            _loop_1();
        }
    }
    script = script.replace(INLINE_FUNC_DEF_REGEX, '');
    return script;
}
exports.replaceInlines = replaceInlines;
//# sourceMappingURL=glsl-function-inliner.js.map