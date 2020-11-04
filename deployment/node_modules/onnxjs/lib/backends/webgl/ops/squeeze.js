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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebGLSqueeze = void 0;
var squeeze_1 = require("../../../ops/squeeze");
var util_1 = require("../../../util");
var reshape_1 = require("./reshape");
var WebGLSqueeze = /** @class */ (function (_super) {
    __extends(WebGLSqueeze, _super);
    function WebGLSqueeze() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLSqueeze.prototype.run = function (inferenceHandler, inputs) {
        var outputDims = util_1.ShapeUtil.squeezeShape(inputs[0].dims, this.axes);
        return [reshape_1.reshape(inferenceHandler, inputs[0], outputDims)];
    };
    return WebGLSqueeze;
}(squeeze_1.Squeeze));
exports.WebGLSqueeze = WebGLSqueeze;
//# sourceMappingURL=squeeze.js.map