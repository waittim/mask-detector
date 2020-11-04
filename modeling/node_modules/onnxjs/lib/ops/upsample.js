"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Upsample = void 0;
var Upsample = /** @class */ (function () {
    function Upsample() {
    }
    Upsample.prototype.initialize = function (attributes) {
        this.mode = attributes.getString('mode', 'nearest');
        this.scales = attributes.getFloats('scales');
        if (this.mode !== 'nearest' && this.mode !== 'linear') {
            throw new Error("unrecognized mode: " + this.mode);
        }
        if (this.mode === 'linear' && this.scales.length !== 2 && this.scales.length !== 4) {
            throw new Error("only support 2-D or 4-D upsampling for linear mode");
        }
        this.roi = new Array(this.scales.length * 2).fill(0);
    };
    Upsample.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length !== 1) {
            return false;
        }
        if (inputs[0].dims.length !== this.scales.length) {
            return false;
        }
        return this.checkInputTypes(inputs);
    };
    Upsample.prototype.checkInputTypes = function (inputs) {
        if (inputs[0].type === 'string') {
            return false;
        }
        return true;
    };
    return Upsample;
}());
exports.Upsample = Upsample;
//# sourceMappingURL=upsample.js.map