import { InstanceNormalization } from '../../../ops/instance-normalization';
import { Tensor } from '../../../tensor';
import { WebGLInferenceHandler } from '../inference-handler';
import { Artifact, ProgramInfo, RunData, TextureLayout } from '../types';
export declare class WebGLInstanceNormalization extends InstanceNormalization {
    run(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): Tensor[];
    checkInputTypes(inputs: Tensor[]): boolean;
    createMeanAndVarianceProgramInfo(inferenceHandler: WebGLInferenceHandler, xLayout: TextureLayout): ProgramInfo;
    createComputOutputProgramInfo(inferenceHandler: WebGLInferenceHandler, xLayout: TextureLayout, scaleLayout: TextureLayout, bLayout: TextureLayout, meanAndVarianceLayout: TextureLayout): ProgramInfo;
    createProgramInfos(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): ProgramInfo[];
    createRunDatas(inferenceHandler: WebGLInferenceHandler, programInfos: ProgramInfo[], inputs: Tensor[]): RunData[];
    protected artifacts: Artifact[];
}
