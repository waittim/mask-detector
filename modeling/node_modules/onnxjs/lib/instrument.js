"use strict";
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.now = exports.Profiler = exports.Logger = void 0;
var NoOpLoggerProvider = /** @class */ (function () {
    function NoOpLoggerProvider() {
    }
    NoOpLoggerProvider.prototype.log = function (severity, content, category) {
        // do nothing
    };
    return NoOpLoggerProvider;
}());
var ConsoleLoggerProvider = /** @class */ (function () {
    function ConsoleLoggerProvider() {
    }
    ConsoleLoggerProvider.prototype.log = function (severity, content, category) {
        console.log(this.color(severity) + " " + (category ? '\x1b[35m' + category + '\x1b[0m ' : '') + content);
    };
    ConsoleLoggerProvider.prototype.color = function (severity) {
        switch (severity) {
            case 'verbose':
                return '\x1b[34;40mv\x1b[0m';
            case 'info':
                return '\x1b[32mi\x1b[0m';
            case 'warning':
                return '\x1b[30;43mw\x1b[0m';
            case 'error':
                return '\x1b[31;40me\x1b[0m';
            default:
                throw new Error("unsupported severity: " + severity);
        }
    };
    return ConsoleLoggerProvider;
}());
var SEVERITY_VALUE = {
    verbose: 1000,
    info: 2000,
    warning: 4000,
    error: 5000
};
var LOGGER_PROVIDER_MAP = (_a = {},
    _a['none'] = new NoOpLoggerProvider(),
    _a['console'] = new ConsoleLoggerProvider(),
    _a);
var LOGGER_DEFAULT_CONFIG = {
    provider: 'console',
    minimalSeverity: 'info',
    logDateTime: true,
    logSourceLocation: false
};
var LOGGER_CONFIG_MAP = (_b = {}, _b[''] = LOGGER_DEFAULT_CONFIG, _b);
function log(arg0, arg1, arg2, arg3) {
    if (arg1 === undefined) {
        // log(category: string): Logger.CategorizedLogger;
        return createCategorizedLogger(arg0);
    }
    else if (arg2 === undefined) {
        // log(severity, content);
        logInternal(arg0, arg1, 1);
    }
    else if (typeof arg2 === 'number' && arg3 === undefined) {
        // log(severity, content, stack)
        logInternal(arg0, arg1, arg2);
    }
    else if (typeof arg2 === 'string' && arg3 === undefined) {
        // log(severity, category, content)
        logInternal(arg0, arg2, 1, arg1);
    }
    else if (typeof arg2 === 'string' && typeof arg3 === 'number') {
        // log(severity, category, content, stack)
        logInternal(arg0, arg2, arg3, arg1);
    }
    else {
        throw new TypeError('input is valid');
    }
}
function createCategorizedLogger(category) {
    return {
        verbose: log.verbose.bind(null, category),
        info: log.info.bind(null, category),
        warning: log.warning.bind(null, category),
        error: log.error.bind(null, category)
    };
}
// NOTE: argument 'category' is put the last parameter beacause typescript
// doesn't allow optional argument put in front of required argument. This
// order is different from a usual logging API.
function logInternal(severity, content, stack, category) {
    var config = LOGGER_CONFIG_MAP[category || ''] || LOGGER_CONFIG_MAP[''];
    if (SEVERITY_VALUE[severity] < SEVERITY_VALUE[config.minimalSeverity]) {
        return;
    }
    if (config.logDateTime) {
        content = new Date().toISOString() + "|" + content;
    }
    if (config.logSourceLocation) {
        // TODO: calculate source location from 'stack'
    }
    LOGGER_PROVIDER_MAP[config.provider].log(severity, content, category);
}
// tslint:disable-next-line:no-namespace
(function (log) {
    function verbose(arg0, arg1) {
        log('verbose', arg0, arg1);
    }
    log.verbose = verbose;
    function info(arg0, arg1) {
        log('info', arg0, arg1);
    }
    log.info = info;
    function warning(arg0, arg1) {
        log('warning', arg0, arg1);
    }
    log.warning = warning;
    function error(arg0, arg1) {
        log('error', arg0, arg1);
    }
    log.error = error;
    function reset(config) {
        LOGGER_CONFIG_MAP = {};
        // tslint:disable-next-line:no-backbone-get-set-outside-model
        set('', config || {});
    }
    log.reset = reset;
    function set(category, config) {
        if (category === '*') {
            reset(config);
        }
        else {
            var previousConfig = LOGGER_CONFIG_MAP[category] || LOGGER_DEFAULT_CONFIG;
            LOGGER_CONFIG_MAP[category] = {
                provider: config.provider || previousConfig.provider,
                minimalSeverity: config.minimalSeverity || previousConfig.minimalSeverity,
                logDateTime: (config.logDateTime === undefined) ? previousConfig.logDateTime : config.logDateTime,
                logSourceLocation: (config.logSourceLocation === undefined) ? previousConfig.logSourceLocation :
                    config.logSourceLocation
            };
        }
        // TODO: we want to support wildcard or regex?
    }
    log.set = set;
})(log || (log = {}));
// tslint:disable-next-line:variable-name
exports.Logger = log;
var Event = /** @class */ (function () {
    function Event(category, name, startTime, endCallback) {
        this.category = category;
        this.name = name;
        this.startTime = startTime;
        this.endCallback = endCallback;
    }
    Event.prototype.end = function () {
        this.endCallback(this);
    };
    return Event;
}());
var EventRecord = /** @class */ (function () {
    function EventRecord(category, name, startTime, endTime) {
        this.category = category;
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
    }
    return EventRecord;
}());
var Profiler = /** @class */ (function () {
    function Profiler(maxNumberEvents, flushBatchSize, flushIntervalInMilliseconds) {
        this._started = false;
        this._flushPointer = 0;
        this._started = false;
        this._maxNumberEvents = maxNumberEvents === undefined ? 10000 : maxNumberEvents;
        this._flushBatchSize = flushBatchSize === undefined ? 10 : flushBatchSize;
        this._flushIntervalInMilliseconds = flushIntervalInMilliseconds === undefined ? 5000 : flushIntervalInMilliseconds;
    }
    Profiler.create = function (config) {
        if (config === undefined) {
            return new this();
        }
        return new this(config.maxNumberEvents, config.flushBatchSize, config.flushIntervalInMilliseconds);
    };
    // start profiling
    Profiler.prototype.start = function () {
        this._started = true;
        this._timingEvents = [];
        this._flushTime = exports.now();
        this._flushPointer = 0;
    };
    // stop profiling
    Profiler.prototype.stop = function () {
        this._started = false;
        for (; this._flushPointer < this._timingEvents.length; this._flushPointer++) {
            this.logOneEvent(this._timingEvents[this._flushPointer]);
        }
    };
    Profiler.prototype.event = function (category, name, func) {
        var event = this._started ? this.begin(category, name) : undefined;
        var isPromise = false;
        try {
            var res_1 = func();
            // we consider a then-able object is a promise
            if (res_1 && typeof res_1.then === 'function') {
                isPromise = true;
                return new Promise(function (resolve, reject) {
                    res_1
                        .then(function (value) {
                        resolve(value);
                        if (event) {
                            event.end();
                        }
                    }, function (reason) {
                        reject(reason);
                        if (event) {
                            event.end();
                        }
                    });
                });
            }
            return res_1;
        }
        finally {
            if (!isPromise && event) {
                event.end();
            }
        }
    };
    // begin an event
    Profiler.prototype.begin = function (category, name) {
        var _this = this;
        if (!this._started) {
            throw new Error('profiler is not started yet');
        }
        var startTime = exports.now();
        this.flush(startTime);
        return new Event(category, name, startTime, function (e) { return _this.end(e); });
    };
    // end the specific event
    Profiler.prototype.end = function (event) {
        if (this._timingEvents.length < this._maxNumberEvents) {
            var endTime = exports.now();
            this._timingEvents.push(new EventRecord(event.category, event.name, event.startTime, endTime));
            this.flush(endTime);
        }
    };
    Profiler.prototype.logOneEvent = function (event) {
        exports.Logger.verbose("Profiler." + event.category, (event.endTime - event.startTime).toFixed(2) + "ms on event '" + event.name + "' at " + event.endTime.toFixed(2));
    };
    Profiler.prototype.flush = function (currentTime) {
        if (this._timingEvents.length - this._flushPointer >= this._flushBatchSize ||
            currentTime - this._flushTime >= this._flushIntervalInMilliseconds) {
            // should flush when either batch size accumlated or interval elepsed
            for (var previousPointer = this._flushPointer; this._flushPointer < previousPointer + this._flushBatchSize &&
                this._flushPointer < this._timingEvents.length; this._flushPointer++) {
                this.logOneEvent(this._timingEvents[this._flushPointer]);
            }
            this._flushTime = exports.now();
        }
    };
    Object.defineProperty(Profiler.prototype, "started", {
        get: function () {
            return this._started;
        },
        enumerable: false,
        configurable: true
    });
    return Profiler;
}());
exports.Profiler = Profiler;
/**
 * returns a number to represent the current timestamp in a resolution as high as possible.
 */
exports.now = (typeof performance !== 'undefined' && performance.now) ? function () { return performance.now(); } : Date.now;
//# sourceMappingURL=instrument.js.map