import { Split } from '../../../ops/split';
import { Tensor } from '../../../tensor';
import { WebGLInferenceHandler } from '../inference-handler';
import { Artifact, ProgramInfo, RunData } from '../types';
export declare class WebGLSplit extends Split {
    run(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): Tensor[];
    getProgramCount(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[], axis: number): number;
    createProgramInfo(inferenceHandler: WebGLInferenceHandler, input: Tensor, axis: number, index: number): ProgramInfo;
    createRunData(inferenceHandler: WebGLInferenceHandler, programInfo: ProgramInfo, inputs: Tensor[]): RunData;
    protected artifacts: Artifact[];
}
