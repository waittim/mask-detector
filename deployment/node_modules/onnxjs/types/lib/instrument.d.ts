export declare namespace Logger {
    interface SeverityTypeMap {
        verbose: 'v';
        info: 'i';
        warning: 'w';
        error: 'e';
    }
    type Severity = keyof SeverityTypeMap;
    type Provider = 'none' | 'console';
    /**
     * Logging config that used to control the behavior of logger
     */
    interface Config {
        /**
         * Specify the logging provider. 'console' by default
         */
        provider?: Provider;
        /**
         * Specify the minimal logger serverity. 'info' by default
         */
        minimalSeverity?: Logger.Severity;
        /**
         * Whether to output date time in log. true by default
         */
        logDateTime?: boolean;
        /**
         * Whether to output source information (Not yet supported). false by default
         */
        logSourceLocation?: boolean;
    }
    interface CategorizedLogger {
        verbose(content: string): void;
        info(content: string): void;
        warning(content: string): void;
        error(content: string): void;
    }
}
export interface Logger {
    (category: string): Logger.CategorizedLogger;
    verbose(content: string): void;
    verbose(category: string, content: string): void;
    info(content: string): void;
    info(category: string, content: string): void;
    warning(content: string): void;
    warning(category: string, content: string): void;
    error(content: string): void;
    error(category: string, content: string): void;
    /**
     * Reset the logger configuration.
     * @param config specify an optional default config
     */
    reset(config?: Logger.Config): void;
    /**
     * Set the logger's behavior on the given category
     * @param category specify a category string. If '*' is specified, all previous configuration will be overwritten. If
     * '' is specified, the default behavior will be updated.
     * @param config the config object to indicate the logger's behavior
     */
    set(category: string, config: Logger.Config): void;
}
export declare const Logger: Logger;
export declare namespace Profiler {
    interface Config {
        maxNumberEvents?: number;
        flushBatchSize?: number;
        flushIntervalInMilliseconds?: number;
    }
    type EventCategory = 'session' | 'node' | 'op' | 'backend';
    interface Event {
        end(): void;
    }
}
declare class Event implements Profiler.Event {
    category: Profiler.EventCategory;
    name: string;
    startTime: number;
    private endCallback;
    constructor(category: Profiler.EventCategory, name: string, startTime: number, endCallback: (e: Event) => void);
    end(): void;
}
export declare class Profiler {
    static create(config?: Profiler.Config): Profiler;
    private constructor();
    start(): void;
    stop(): void;
    event<T>(category: Profiler.EventCategory, name: string, func: () => T): T;
    event<T>(category: Profiler.EventCategory, name: string, func: () => Promise<T>): Promise<T>;
    begin(category: Profiler.EventCategory, name: string): Event;
    private end;
    private logOneEvent;
    private flush;
    get started(): boolean;
    private _started;
    private _timingEvents;
    private readonly _maxNumberEvents;
    private readonly _flushBatchSize;
    private readonly _flushIntervalInMilliseconds;
    private _flushTime;
    private _flushPointer;
}
/**
 * returns a number to represent the current timestamp in a resolution as high as possible.
 */
export declare const now: () => number;
export {};
