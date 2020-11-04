import * as bindingCore from './wasm-binding-core';
import { WasmCallArgument } from './wasm-binding-core';
export { WasmCallArgument } from './wasm-binding-core';
interface PerformanceData extends bindingCore.PerformanceData {
    startTimeWorker?: number;
    endTimeWorker?: number;
}
/**
 * initialize the WASM instance.
 *
 * this function should be called before any other calls to methods in WasmBinding.
 */
export declare function init(numWorkers: number, initTimeout: number): Promise<void>;
export declare class WasmBinding extends bindingCore.WasmBinding {
    protected static instance?: WasmBinding;
    static getInstance(): WasmBinding;
    static get workerNumber(): number;
    ccallRemote(workerId: number, functionName: string, ...params: WasmCallArgument[]): Promise<PerformanceData>;
}
