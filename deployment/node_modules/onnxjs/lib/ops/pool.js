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
exports.GlobalMaxPool = exports.MaxPool = exports.GlobalAveragePool = exports.AveragePool = void 0;
var PoolBase = /** @class */ (function () {
    function PoolBase() {
    }
    PoolBase.prototype.checkInputs = function (inputs) {
        if (!inputs || inputs.length !== 1) {
            return false;
        }
        return this.checkInputTypes(inputs);
    };
    PoolBase.prototype.checkInputTypes = function (inputs) {
        if (inputs[0].type !== 'float32' && inputs[0].type !== 'float64') {
            return false;
        }
        return true;
    };
    return PoolBase;
}());
var AveragePool = /** @class */ (function (_super) {
    __extends(AveragePool, _super);
    function AveragePool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AveragePool.prototype.initialize = function (attributes) {
        this.autoPad = attributes.getString('auto_pad', 'NOTSET');
        this.kernelShape = attributes.getInts('kernel_shape');
        this.strides = attributes.getInts('strides', []);
        this.pads = attributes.getInts('pads', []);
        this.countIncludePad = (attributes.getInt('count_include_pad', 0) === 0 ? false : true);
        this.ceilMode = attributes.getInt('ceil_mode', 0);
        // TODO: support attribute 'ceil_mode'
        if (this.ceilMode !== 0) {
            throw new Error("using ceil() in shape computation is not yet supported for AveragePool");
        }
    };
    return AveragePool;
}(PoolBase));
exports.AveragePool = AveragePool;
var GlobalAveragePool = /** @class */ (function (_super) {
    __extends(GlobalAveragePool, _super);
    function GlobalAveragePool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GlobalAveragePool.prototype.initialize = function (attributes) {
        this.countIncludePad = (attributes.getInt('count_include_pad', 0) === 0 ? false : true);
    };
    return GlobalAveragePool;
}(PoolBase));
exports.GlobalAveragePool = GlobalAveragePool;
var MaxPool = /** @class */ (function (_super) {
    __extends(MaxPool, _super);
    function MaxPool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    MaxPool.prototype.initialize = function (attributes) {
        this.autoPad = attributes.getString('auto_pad', 'NOTSET');
        this.kernelShape = attributes.getInts('kernel_shape');
        this.strides = attributes.getInts('strides', []);
        this.pads = attributes.getInts('pads', []);
        this.ceilMode = attributes.getInt('ceil_mode', 0);
        this.storageOrder = attributes.getInt('storage_order', 0);
        // TODO: support attribute 'ceil_mode' and 'storage_order'
        if (this.storageOrder !== 0) {
            throw new Error("column major storage order is not yet supported for MaxPool");
        }
        if (this.ceilMode !== 0) {
            throw new Error("using ceil() in shape computation is not yet supported for MaxPool");
        }
    };
    return MaxPool;
}(PoolBase));
exports.MaxPool = MaxPool;
var GlobalMaxPool = /** @class */ (function (_super) {
    __extends(GlobalMaxPool, _super);
    function GlobalMaxPool() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    GlobalMaxPool.prototype.initialize = function (attributes) { };
    return GlobalMaxPool;
}(PoolBase));
exports.GlobalMaxPool = GlobalMaxPool;
//# sourceMappingURL=pool.js.map