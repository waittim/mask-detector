"use strict";
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
exports.tile = exports.CpuTile = void 0;
var tile_1 = require("../../../ops/tile");
var tensor_1 = require("../../../tensor");
var util_1 = require("../../../util");
var CpuTile = /** @class */ (function (_super) {
    __extends(CpuTile, _super);
    function CpuTile() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CpuTile.prototype.run = function (inferenceHandler, inputs) {
        var output = tile(inputs[0], inputs[1]);
        return [output];
    };
    return CpuTile;
}(tile_1.Tile));
exports.CpuTile = CpuTile;
function tile(x, repeats) {
    var dims = x.dims ? x.dims : [x.data.length];
    var rank = dims.length;
    var newDims = new Array(rank);
    for (var i = 0; i < rank; i++) {
        newDims[i] = dims[i] * repeats.numberData[i];
    }
    var dimsStrides = util_1.ShapeUtil.computeStrides(dims);
    var newDimsStrides = util_1.ShapeUtil.computeStrides(newDims);
    var output = new tensor_1.Tensor(newDims, x.type);
    var Y = output.numberData;
    // TensorTransformUtils.createTypedArray(x.type, ShapeUtil.size(newDims));
    var X = x.data;
    for (var i = 0; i < Y.length; ++i) {
        var newLogicalIndex = util_1.ShapeUtil.offsetToIndices(i, newDimsStrides);
        var oldLogicalIndex = new Array(rank);
        for (var j = 0; j < rank; ++j) {
            oldLogicalIndex[j] = newLogicalIndex[j] % x.dims[j];
        }
        var oldOffset = util_1.ShapeUtil.indicesToOffset(oldLogicalIndex, dimsStrides);
        Y[i] = X[oldOffset];
    }
    return output;
}
exports.tile = tile;
//# sourceMappingURL=tile.js.map