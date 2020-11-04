import { Upsample } from '../../../ops/upsample';
import { Tensor } from '../../../tensor';
import { WebGLInferenceHandler } from '../inference-handler';
import { ProgramInfo, RunData, WebGLOperator } from '../types';
export declare class WebGLUpsample extends Upsample implements WebGLOperator {
    run(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): Tensor[];
    createProgramInfo(handler: WebGLInferenceHandler, inputs: Tensor[]): ProgramInfo;
    createRunData(handler: WebGLInferenceHandler, programInfo: ProgramInfo, inputs: Tensor[]): RunData;
}
