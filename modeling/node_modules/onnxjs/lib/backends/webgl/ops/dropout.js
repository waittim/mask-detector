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
exports.WebGLDropout = void 0;
var dropout_1 = require("../../../ops/dropout");
var WebGLDropout = /** @class */ (function (_super) {
    __extends(WebGLDropout, _super);
    function WebGLDropout() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WebGLDropout.prototype.run = function (inferenceHandler, inputs) {
        if (this.testMode) {
            return [inputs[0]];
        }
        throw new Error("Non test mode Dropout is not implemented yet");
    };
    WebGLDropout.prototype.createProgramInfo = function (handler, inputs) {
        throw new Error("Non test mode Dropout is not implemented yet");
    };
    WebGLDropout.prototype.createRunData = function (handler, programInfo, inputs) {
        throw new Error("Non test mode Dropout is not implemented yet");
    };
    return WebGLDropout;
}(dropout_1.Dropout));
exports.WebGLDropout = WebGLDropout;
//# sourceMappingURL=dropout.js.map