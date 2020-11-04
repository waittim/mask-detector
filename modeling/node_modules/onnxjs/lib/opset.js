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
exports.resolveOperator = void 0;
function resolveOperator(node, opsets, rules) {
    var e_1, _a, e_2, _b;
    try {
        for (var rules_1 = __values(rules), rules_1_1 = rules_1.next(); !rules_1_1.done; rules_1_1 = rules_1.next()) {
            var rule = rules_1_1.value;
            var opType = rule[0];
            var domain = rule[1];
            var versionSelector = rule[2];
            var opConstructor = rule[3];
            if (node.opType === opType) { // operator type matches
                try {
                    for (var opsets_1 = (e_2 = void 0, __values(opsets)), opsets_1_1 = opsets_1.next(); !opsets_1_1.done; opsets_1_1 = opsets_1.next()) {
                        var opset = opsets_1_1.value;
                        // opset '' and 'ai.onnx' are considered the same.
                        if (opset.domain === domain || (opset.domain === 'ai.onnx' && domain === '')) { // opset domain found
                            if (matchSelector(opset.version, versionSelector)) {
                                return opConstructor(node);
                            }
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (opsets_1_1 && !opsets_1_1.done && (_b = opsets_1.return)) _b.call(opsets_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (rules_1_1 && !rules_1_1.done && (_a = rules_1.return)) _a.call(rules_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    throw new TypeError("cannot resolve operator '" + node.opType + "' with opsets: " + opsets.map(function (set) { return (set.domain || 'ai.onnx') + " v" + set.version; }).join(', '));
}
exports.resolveOperator = resolveOperator;
function matchSelector(version, selector) {
    if (selector.endsWith('+')) {
        // minimum version match ('7+' expects version>=7)
        var rangeStart = Number.parseInt(selector.substring(0, selector.length - 1), 10);
        return !isNaN(rangeStart) && rangeStart <= version;
    }
    else if (selector.split('-').length === 2) {
        // range match ('6-8' expects 6<=version<=8)
        var pair = selector.split('-');
        var rangeStart = Number.parseInt(pair[0], 10);
        var rangeEnd = Number.parseInt(pair[1], 10);
        return !isNaN(rangeStart) && !isNaN(rangeEnd) && rangeStart <= version && version <= rangeEnd;
    }
    else {
        // exact match ('7' expects version===7)
        return Number.parseInt(selector, 10) === version;
    }
}
//# sourceMappingURL=opset.js.map