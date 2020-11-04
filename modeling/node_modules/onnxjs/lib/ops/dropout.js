"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dropout = void 0;
var Dropout = /** @class */ (function () {
    function Dropout() {
    }
    Dropout.prototype.initialize = function (attributes) {
        this.ratio = attributes.getFloat('ratio', 0.5);
        this.testMode = true; // this is a hack to reflect that test mode is hardcoded
    };
    Dropout.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length !== 1) {
            return false;
        }
        return this.checkInputTypes(inputs);
    };
    Dropout.prototype.checkInputTypes = function (inputs) {
        if (inputs[0].type !== 'float32' && inputs[0].type !== 'float64') {
            return false;
        }
        return true;
    };
    return Dropout;
}());
exports.Dropout = Dropout;
//# sourceMappingURL=dropout.js.map