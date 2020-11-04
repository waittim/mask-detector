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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pad = exports.CpuPad = void 0;
var pad_1 = require("../../../ops/pad");
var tensor_1 = require("../../../tensor");
// import { getLogger } from 'log4js';
var CpuPad = /** @class */ (function (_super) {
    __extends(CpuPad, _super);
    function CpuPad() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuPad.prototype.run = function (inferenceHandler, inputs) {
        var output = pad(inputs[0], this.mode, this.value, this.pads);
        return [output];
    };
    return CpuPad;
}(pad_1.Pad));
exports.CpuPad = CpuPad;
function pad(x, mode, value, pads) {
    var inputDimensions = x.dims;
    var outputDimensions = getPadDimension(inputDimensions, pads);
    var output = new tensor_1.Tensor(outputDimensions, x.type);
    switch (mode) {
        case 'constant':
            for (var ind = 0; ind < outputDimensions.reduce(function (acc, cur) { return acc * cur; }, 1); ind++) {
                var inx = mapToArrayIndex(ind, outputDimensions);
                output.set(inx, value);
            }
            for (var ind = 0; ind < inputDimensions.reduce(function (acc, cur) { return acc * cur; }, 1); ind++) {
                var inx = mapToArrayIndex(ind, inputDimensions);
                output.set(inx.map(function (v, i) { return v + pads[i]; }), x.get(inx));
            }
            break;
        case 'reflect':
            for (var ind = 0; ind < outputDimensions.reduce(function (acc, cur) { return acc * cur; }, 1); ind++) {
                var inx = mapToArrayIndex(ind, outputDimensions);
                output.set(inx, x.get(inx.map(function (v, i) { return getReflectionIndex(v, pads[i], inputDimensions[i]); })));
            }
            break;
        case 'edge':
            for (var ind = 0; ind < outputDimensions.reduce(function (acc, cur) { return acc * cur; }, 1); ind++) {
                var inx = mapToArrayIndex(ind, outputDimensions);
                output.set(inx, x.get(inx.map(function (v, i) { return getEdgeIndex(v, pads[i], inputDimensions[i]); })));
            }
            break;
        default:
            throw Error('Illegal pad mode.');
    }
    return output;
}
exports.pad = pad;
function getReflectionIndex(index, offset, size) {
    if (index < offset) {
        var position = (offset - index - 1) % (size - 1);
        var direction = Math.floor((offset - index - 1) / (size - 1)) % 2;
        if (direction === 1) {
            return size - position - 2;
        }
        else {
            return position + 1;
        }
    }
    else if (index < offset + size) {
        return index - offset;
    }
    else {
        var position = (index - (offset + size)) % (size - 1);
        var direction = Math.floor((index - (offset + size)) / (size - 1)) % 2;
        if (direction === 0) {
            return size - position - 2;
        }
        else {
            return position + 1;
        }
    }
}
function getEdgeIndex(index, offset, size) {
    if (index < offset) {
        return 0;
    }
    else if (index < offset + size) {
        return index - offset;
    }
    else {
        return size - 1;
    }
}
function mapToArrayIndex(numberIndex, dimension) {
    if (numberIndex < 0 || (dimension.some(function (val) { return val < 0; }))) {
        throw Error('Array index out of range');
    }
    var arrayIndex = __spread(dimension);
    arrayIndex.reverse();
    function product(array) {
        return array.reduce(function (acc, cur) { return acc * cur; }, 1);
    }
    return arrayIndex.map(function (value, index, array) { return Math.floor(numberIndex / product(array.slice(0, index))) % value; })
        .reverse();
}
function getPadDimension(inputDimensions, pads) {
    var outputDimensions = Array(inputDimensions.length);
    Object.assign(outputDimensions, inputDimensions);
    for (var i = 0; i < inputDimensions.length; i++) {
        outputDimensions[i] += pads[i] + pads[i + outputDimensions.length];
    }
    return outputDimensions;
}
//# sourceMappingURL=pad.js.map