import { AveragePool, GlobalAveragePool, GlobalMaxPool, MaxPool } from '../../../ops/pool';
import { Tensor } from '../../../tensor';
import { WebGLInferenceHandler } from '../inference-handler';
import { ProgramInfo, RunData, TextureLayout, WebGLOperator } from '../types';
export declare class WebGLGlobalAveragePool extends GlobalAveragePool implements WebGLOperator {
    run(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): Tensor[];
    createProgramInfo(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): ProgramInfo;
    createRunData(inferenceHandler: WebGLInferenceHandler, programInfo: ProgramInfo, inputs: Tensor[]): RunData;
}
export declare class WebGLAveragePool extends AveragePool implements WebGLOperator {
    run(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): Tensor[];
    createProgramInfo(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): ProgramInfo;
    createRunData(inferenceHandler: WebGLInferenceHandler, programInfo: ProgramInfo, inputs: Tensor[]): RunData;
}
export declare class WebGLGlobalMaxPool extends GlobalMaxPool implements WebGLOperator {
    run(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): Tensor[];
    createProgramInfo(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): ProgramInfo;
    createRunData(inferenceHandler: WebGLInferenceHandler, programInfo: ProgramInfo, inputs: Tensor[]): RunData;
}
export declare class WebGLMaxPool extends MaxPool implements WebGLOperator {
    run(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): Tensor[];
    createProgramInfo(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): ProgramInfo;
    createRunData(inferenceHandler: WebGLInferenceHandler, programInfo: ProgramInfo, inputs: Tensor[]): RunData;
}
export declare function GeneratePoolingCode(x: TextureLayout, kernelShape: number[], pads: number[], strides: number[], op1: string, op2: string, startVal: string): string;
export declare function copyArray(array: ReadonlyArray<number>, arrayName: string): string;
export declare function offsetToIndices(rank: number): string;
