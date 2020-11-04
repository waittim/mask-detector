import { Pad } from '../../../ops/pad';
import { Tensor } from '../../../tensor';
import { Glsl } from '../glsl-source';
import { WebGLInferenceHandler } from '../inference-handler';
import { ProgramInfo, RunData, TextureLayout, WebGLOperator } from '../types';
export declare class WebGLPad extends Pad implements WebGLOperator {
    run(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): Tensor[];
    createProgramInfo(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): ProgramInfo;
    createRunData(inferenceHandler: WebGLInferenceHandler, programInfo: ProgramInfo, inputs: Tensor[]): RunData;
}
export declare function getPadFunction(glsl: Glsl, name: string, inputLayout: TextureLayout, mode: string, pads: number[], value: number): string;
