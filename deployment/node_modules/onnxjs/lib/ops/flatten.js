"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Flatten = void 0;
var Flatten = /** @class */ (function () {
    function Flatten() {
    }
    Flatten.prototype.initialize = function (attributes) {
        this.axis = attributes.getInt('axis', 1); // default axis is 1
    };
    Flatten.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length !== 1) {
            return false;
        }
        var r = inputs[0].dims.length;
        if (r === 0) {
            return false; // scalar tensor is not supported
        }
        if (this.axis < -r || this.axis > r) {
            return false;
        }
        return this.checkInputTypes(inputs);
    };
    Flatten.prototype.checkInputTypes = function (inputs) {
        // TODO: Support string type
        if (inputs[0].type === 'string') {
            return false;
        }
        return true;
    };
    return Flatten;
}());
exports.Flatten = Flatten;
//# sourceMappingURL=flatten.js.map