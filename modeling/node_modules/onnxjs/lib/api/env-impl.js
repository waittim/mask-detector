"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.envImpl = void 0;
var env_1 = require("../env");
var ENV = /** @class */ (function () {
    function ENV() {
    }
    Object.defineProperty(ENV.prototype, "debug", {
        get: function () {
            return env_1.env.debug;
        },
        set: function (value) {
            env_1.env.debug = value;
        },
        enumerable: false,
        configurable: true
    });
    return ENV;
}());
exports.envImpl = new ENV();
//# sourceMappingURL=env-impl.js.map