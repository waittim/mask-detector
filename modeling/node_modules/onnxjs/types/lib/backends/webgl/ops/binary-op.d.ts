import { BinaryOp } from '../../../ops/binary-op';
import { Tensor } from '../../../tensor';
import { GlslValueFunction } from '../glsl-definitions';
import { WebGLInferenceHandler } from '../inference-handler';
import { ProgramInfo, RunData, WebGLOperator } from '../types';
export declare class WebGLBinaryOp extends BinaryOp implements WebGLOperator {
    protected glslFunc: GlslValueFunction;
    constructor(typeConstraint: ReadonlyArray<Tensor.DataType>, glslFunc: GlslValueFunction, opType?: string, resultType?: Tensor.DataType);
    run(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): Tensor[];
    createProgramInfo(handler: WebGLInferenceHandler, inputs: Tensor[]): ProgramInfo;
    createRunData(handler: WebGLInferenceHandler, programInfo: ProgramInfo, inputs: Tensor[]): RunData;
}
export declare function glslAdd(): GlslValueFunction;
export declare function glslDiv(): GlslValueFunction;
export declare function glslMul(): GlslValueFunction;
export declare function glslSub(): GlslValueFunction;
export declare function glslEqual(): GlslValueFunction;
export declare function glslGreater(): GlslValueFunction;
export declare function glslLess(): GlslValueFunction;
export declare function glslAnd(): GlslValueFunction;
export declare function glslOr(): GlslValueFunction;
export declare function glslXor(): GlslValueFunction;
export declare function glslPow(): GlslValueFunction;
export declare function glslPRelu(): GlslValueFunction;
