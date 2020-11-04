"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gather = void 0;
var operators_1 = require("../operators");
var Gather = /** @class */ (function () {
    function Gather() {
    }
    Gather.prototype.initialize = function (attributes) {
        this.axis = attributes.getInt('axis', 0);
    };
    Gather.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length !== 2) {
            return false;
        }
        var tensorRank = inputs[0].dims.length;
        if (tensorRank < 1) {
            return false;
        }
        if (this.axis < -tensorRank || this.axis > tensorRank - 1) {
            return false;
        }
        return this.checkInputTypes(inputs);
    };
    Gather.prototype.checkInputTypes = function (inputs) {
        if (operators_1.NUMBER_TYPES.indexOf(inputs[0].type) === -1) {
            return false;
        }
        if (inputs[1].type !== 'int32' && inputs[1].type !== 'int16') {
            return false;
        }
        return true;
    };
    return Gather;
}());
exports.Gather = Gather;
//# sourceMappingURL=gather.js.map