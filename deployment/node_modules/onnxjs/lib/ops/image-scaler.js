"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageScaler = void 0;
var ImageScaler = /** @class */ (function () {
    function ImageScaler() {
    }
    ImageScaler.prototype.initialize = function (attributes) {
        this.scale = attributes.getFloat('scale');
        this.bias = attributes.getFloats('bias');
    };
    ImageScaler.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length !== 1) {
            return false;
        }
        if (inputs[0].dims.length !== 4) {
            return false;
        }
        return this.checkInputTypes(inputs);
    };
    ImageScaler.prototype.checkInputTypes = function (inputs) {
        if (inputs[0].type !== 'float32' && inputs[0].type !== 'float64') {
            return false;
        }
        return true;
    };
    return ImageScaler;
}());
exports.ImageScaler = ImageScaler;
//# sourceMappingURL=image-scaler.js.map