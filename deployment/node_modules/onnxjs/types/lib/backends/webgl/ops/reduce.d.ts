import { ReduceBase } from '../../../ops/reduce-op';
import { Tensor } from '../../../tensor';
import { WebGLInferenceHandler } from '../inference-handler';
import { ProgramInfo, RunData, WebGLOperator } from '../types';
declare abstract class WebGLGenericReduce extends ReduceBase implements WebGLOperator {
    abstract getOps(inputs: Tensor[], axes: number[]): string[];
    run(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): Tensor[];
    createProgramInfo(handler: WebGLInferenceHandler, inputs: Tensor[]): ProgramInfo;
    createRunData(handler: WebGLInferenceHandler, programInfo: ProgramInfo, inputs: Tensor[]): RunData;
}
export declare class WebGLReduceSum extends WebGLGenericReduce {
    getOps(inputs: Tensor[]): string[];
}
export declare class WebGLReduceMean extends WebGLGenericReduce {
    getOps(inputs: Tensor[], axes: number[]): string[];
}
export declare class WebGLReduceMax extends WebGLGenericReduce {
    getOps(inputs: Tensor[], axes: number[]): string[];
}
export declare class WebGLReduceMin extends WebGLGenericReduce {
    getOps(inputs: Tensor[], axes: number[]): string[];
}
export declare class WebGLReduceProd extends WebGLGenericReduce {
    getOps(inputs: Tensor[]): string[];
}
export declare class WebGLReduceLogSum extends WebGLGenericReduce {
    getOps(inputs: Tensor[]): string[];
}
export declare class WebGLReduceSumSquare extends WebGLGenericReduce {
    getOps(inputs: Tensor[]): string[];
}
export {};
