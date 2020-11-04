import { Softmax } from '../../../ops/softmax';
import { Tensor } from '../../../tensor';
import { WebGLInferenceHandler } from '../inference-handler';
import { Artifact, ProgramInfo, RunData, TextureLayout } from '../types';
export declare class WebGLSoftmax extends Softmax {
    constructor();
    run(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): Tensor[];
    createSoftMaxProgramInfo(inferenceHandler: WebGLInferenceHandler, input: Tensor, N: number, D: number, maxElementPerLogicalRow: TextureLayout, normalizationPerLogicalRow: TextureLayout): ProgramInfo;
    /**
     * Create a texture that contains the normalization factor for each of the 'N' rows
     */
    createComputScaleProgramInfo(inferenceHandler: WebGLInferenceHandler, x: Tensor, N: number, D: number, maxElementPerLogicalRow: TextureLayout, outputShape: number[]): ProgramInfo;
    /**
     * Create a texture that contains the maximum value of each of the 'N' rows
     */
    createComputeMaxProgramInfo(inferenceHandler: WebGLInferenceHandler, x: Tensor, N: number, D: number, outputShape: number[]): ProgramInfo;
    createProgramInfos(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): ProgramInfo[];
    createRunDatas(inferenceHandler: WebGLInferenceHandler, programInfos: ProgramInfo[], inputs: Tensor[]): RunData[];
    protected artifacts: Artifact[];
}
