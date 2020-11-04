"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlwaysKeepOriginalSizeStrategy = void 0;
var instrument_1 = require("../../instrument");
/**
 * This strategy try to find the minimal max(W,H) that fulfills (W * H == totalSize)
 */
var AlwaysKeepOriginalSizeStrategy = /** @class */ (function () {
    function AlwaysKeepOriginalSizeStrategy(maxTextureSize) {
        this.maxTextureSize = maxTextureSize;
    }
    AlwaysKeepOriginalSizeStrategy.prototype.computeTextureWH = function (shape, prefs) {
        // scalar tensor
        if (shape.length === 0) {
            return [1, 1];
        }
        var maxTextureSize = this.maxTextureSize;
        if (prefs) {
            // check to see if dims fit
            var wsize = prefs.breakAxis >= shape.length ? 1 : shape.slice(prefs.breakAxis).reduce(function (a, b) { return a * b; });
            var hsize = prefs.breakAxis <= 0 ? 1 : shape.slice(0, prefs.breakAxis).reduce(function (a, b) { return a * b; });
            if (wsize > maxTextureSize || hsize > maxTextureSize) {
                // ignore preferences
                // continue with default layout
                instrument_1.Logger.verbose('TextureLayout', "Given width/height preferences were unattainable: shape:" + shape + ", breakAxis:" + prefs.breakAxis);
            }
            else {
                return [wsize, hsize];
            }
        }
        var totalSize = shape.reduce(function (a, b) { return a * b; });
        var width = Math.floor(Math.sqrt(totalSize));
        for (; width < maxTextureSize && width < totalSize; width++) {
            if (totalSize % width === 0) {
                break;
            }
        }
        if (width >= maxTextureSize || totalSize % width !== 0) {
            throw new Error("The given dimensions are outside this GPU's boundaries: " + shape);
        }
        return [width, totalSize / width];
    };
    return AlwaysKeepOriginalSizeStrategy;
}());
exports.AlwaysKeepOriginalSizeStrategy = AlwaysKeepOriginalSizeStrategy;
//# sourceMappingURL=texture-layout-strategy.js.map