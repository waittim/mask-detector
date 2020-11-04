import { InferenceHandler } from '../../backend';
import { Profiler } from '../../instrument';
import { CpuSessionHandler } from './session-handler';
export declare class CpuInferenceHandler implements InferenceHandler {
    readonly session: CpuSessionHandler;
    readonly profiler?: Readonly<Profiler> | undefined;
    constructor(session: CpuSessionHandler, profiler?: Readonly<Profiler> | undefined);
    dispose(): void;
}
