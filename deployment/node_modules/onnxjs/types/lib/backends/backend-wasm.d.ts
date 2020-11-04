import { Backend as BackendInterface } from '../api/onnx';
import { Backend, SessionHandler } from '../backend';
import { Session } from '../session';
export declare let bindingInitPromise: Promise<void> | undefined;
declare type WasmOptions = BackendInterface.WasmOptions;
export declare class WasmBackend implements Backend, WasmOptions {
    disabled?: boolean;
    worker: number;
    cpuFallback: boolean;
    initTimeout: number;
    constructor();
    initialize(): Promise<boolean>;
    createSessionHandler(context: Session.Context): SessionHandler;
    dispose(): void;
    isWasmSupported(): Promise<boolean>;
}
export {};
