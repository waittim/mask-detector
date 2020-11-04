"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebGLTile = void 0;
var tile_1 = require("../../../ops/tile");
var WebGLTile = /** @class */ (function (_super) {
    __extends(WebGLTile, _super);
    function WebGLTile() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLTile.prototype.run = function (inferenceHandler, inputs) {
        return inferenceHandler.run(this, inputs);
    };
    WebGLTile.prototype.createProgramInfo = function (handler, inputs) {
        var inputShape = inputs[0].dims.slice();
        var outputShape = new Array(inputShape.length); // inputs[0].dims.slice();
        var tileOps = [];
        for (var i = 0; i < inputShape.length; i++) {
            outputShape[i] = inputShape[i] * inputs[1].numberData[i];
            tileOps.push("inputIdx[" + i + "] = int(mod(float(outputIdx[" + i + "]), " + inputShape[i] + ".));");
        }
        var rank = outputShape.length;
        var shaderSource = "\n    float process(int outputIdx[" + rank + "]) {\n      int inputIdx[" + rank + "];\n      " + tileOps.join('\n') + "\n      return _A(inputIdx);\n    }";
        return {
            inputLayouts: inputs.map(function (t) { return handler.getOrCreateTextureLayout(t); }),
            outputLayout: handler.createTextureLayoutFromShape(outputShape),
            samplers: ['A'],
            shaderSource: shaderSource,
        };
    };
    WebGLTile.prototype.createRunData = function (handler, programInfo, inputs) {
        var inputTDs = inputs.map(function (t, i) { return handler.getOrCreateTextureData(t, programInfo.inputLayouts[i]); });
        return {
            inputTextureDatas: inputTDs,
            outputTextureData: handler.createTextureDataFromLayout(programInfo.outputLayout, inputTDs[0].tensor.type),
            uniformData: {}
        };
    };
    return WebGLTile;
}(tile_1.Tile));
exports.WebGLTile = WebGLTile;
//# sourceMappingURL=tile.js.map