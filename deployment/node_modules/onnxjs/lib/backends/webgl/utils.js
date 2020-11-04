"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackedShape = void 0;
/**
 * Given a non RGBA shape calculate the R version
 * It is assumed that the dimensions are multiples of given channels
 * NOTE: it is always the last dim that gets packed.
 * @param unpackedShape original shape to create a packed version from
 */
function getPackedShape(unpackedShape) {
    var len = unpackedShape.length;
    return unpackedShape.slice(0, len - 1).concat(unpackedShape[len - 1] / 4);
}
exports.getPackedShape = getPackedShape;
//# sourceMappingURL=utils.js.map