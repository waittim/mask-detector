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
exports.WebGLFlatten = void 0;
var flatten_1 = require("../../../ops/flatten");
var util_1 = require("../../../util");
var reshape_1 = require("./reshape");
var WebGLFlatten = /** @class */ (function (_super) {
    __extends(WebGLFlatten, _super);
    function WebGLFlatten() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLFlatten.prototype.run = function (inferenceHandler, inputs) {
        var outputDims = util_1.ShapeUtil.flattenShape(inputs[0].dims, this.axis);
        return [reshape_1.reshape(inferenceHandler, inputs[0], outputDims)];
    };
    return WebGLFlatten;
}(flatten_1.Flatten));
exports.WebGLFlatten = WebGLFlatten;
//# sourceMappingURL=flatten.js.map