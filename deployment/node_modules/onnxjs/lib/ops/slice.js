"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.SliceV10 = exports.Slice = void 0;
var Slice = /** @class */ (function () {
    function Slice() {
    }
    Slice.prototype.initialize = function (attributes) {
        this.starts = attributes.getInts('starts');
        this.ends = attributes.getInts('ends');
        this.axes = attributes.getInts('axes', []);
    };
    Slice.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length !== 1) {
            return false;
        }
        return this.checkInputTypes(inputs);
    };
    Slice.prototype.checkInputTypes = function (inputs) {
        if (inputs[0].type !== 'float32' && inputs[0].type !== 'float64') {
            return false;
        }
        return true;
    };
    return Slice;
}());
exports.Slice = Slice;
var SliceV10 = /** @class */ (function () {
    function SliceV10() {
    }
    SliceV10.prototype.initialize = function (attributes) { };
    SliceV10.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length < 3 || inputs.length > 5) {
            return false;
        }
        return this.checkInputTypes(inputs);
    };
    SliceV10.prototype.checkInputTypes = function (inputs) {
        if (inputs[1].type !== 'int32' || inputs[1].dims.length !== 1) {
            return false;
        }
        if (inputs[2].type !== 'int32' || inputs[2].dims.length !== 1) {
            return false;
        }
        if (inputs.length >= 4 && (inputs[3].type !== 'int32' || inputs[3].dims.length !== 1)) {
            return false;
        }
        if (inputs.length >= 5 && (inputs[4].type !== 'int32' || inputs[4].dims.length !== 1)) {
            return false;
        }
        return true;
    };
    return SliceV10;
}());
exports.SliceV10 = SliceV10;
//# sourceMappingURL=slice.js.map