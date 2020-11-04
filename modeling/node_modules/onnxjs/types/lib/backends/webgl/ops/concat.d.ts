import { Concat } from '../../../ops/concat';
import { Tensor } from '../../../tensor';
import { WebGLInferenceHandler } from '../inference-handler';
import { ProgramInfo, RunData, WebGLOperator } from '../types';
export declare class WebGLConcat extends Concat implements WebGLOperator {
    run(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): Tensor[];
    createProgramInfo(handler: WebGLInferenceHandler, inputs: Tensor[]): ProgramInfo;
    createRunData(handler: WebGLInferenceHandler, programInfo: ProgramInfo, inputs: Tensor[]): RunData;
    private getTextureIndexWhereDataResidesLinearSearch;
    private getTextureIndexWhereDataResidesBinarySearch;
    private fetchDataFromCorrectTextureMethod;
    private getValueFromArrayIndexMethod;
}
