import { Environment } from './env';
declare class ENV implements Environment {
    set debug(value: boolean);
    get debug(): boolean;
}
export declare const envImpl: ENV;
export {};
