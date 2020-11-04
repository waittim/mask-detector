import { Sum } from '../../../ops/sum';
import { Tensor } from '../../../tensor';
import { WebGLInferenceHandler } from '../inference-handler';
import { ProgramInfo, RunData, WebGLOperator } from '../types';
export declare class WebGLSum extends Sum implements WebGLOperator {
    run(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): Tensor[];
    createProgramInfo(handler: WebGLInferenceHandler, inputs: Tensor[]): ProgramInfo;
    createRunData(handler: WebGLInferenceHandler, programInfo: ProgramInfo, inputs: Tensor[]): RunData;
}
