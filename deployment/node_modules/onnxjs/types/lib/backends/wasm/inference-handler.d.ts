import { InferenceHandler } from '../../backend';
import { Profiler } from '../../instrument';
import { WasmSessionHandler } from './session-handler';
export declare class WasmInferenceHandler implements InferenceHandler {
    readonly session: WasmSessionHandler;
    readonly profiler?: Readonly<Profiler> | undefined;
    constructor(session: WasmSessionHandler, profiler?: Readonly<Profiler> | undefined);
    dispose(): void;
}
