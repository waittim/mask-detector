import { Transpose } from '../../../ops/transpose';
import { Tensor } from '../../../tensor';
import { GlslPositionalFunction } from '../glsl-definitions';
import { WebGLInferenceHandler } from '../inference-handler';
import { ProgramInfo, RunData, WebGLOperator } from '../types';
export declare class WebGLTranspose extends Transpose implements WebGLOperator {
    run(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): Tensor[];
    getOutputShape(inputShapes: Array<ReadonlyArray<number>>): ReadonlyArray<number>;
    createProgramInfo(handler: WebGLInferenceHandler, inputs: Tensor[]): ProgramInfo;
    createRunData(handler: WebGLInferenceHandler, programInfo: ProgramInfo, inputs: Tensor[]): RunData;
    getPositionalFunction(handler: WebGLInferenceHandler, inputShape: number[], name?: string): GlslPositionalFunction;
    protected getAdjustedPerm(inputShape: ReadonlyArray<number>): number[];
    protected getPermFunctionBody(name: string, perm: number[], rank: number): string;
}
