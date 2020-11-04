import { Gemm } from '../../../ops/gemm';
import { Tensor } from '../../../tensor';
import { WebGLInferenceHandler } from '../inference-handler';
import { ProgramInfo, RunData, WebGLOperator } from '../types';
export declare class WebGLGemm extends Gemm implements WebGLOperator {
    run(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): Tensor[];
    createProgramInfo(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): ProgramInfo;
    createRunData(inferenceHandler: WebGLInferenceHandler, programInfo: ProgramInfo, inputs: Tensor[]): RunData;
}
