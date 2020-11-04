import { Conv } from '../../../ops/conv';
import { Tensor } from '../../../tensor';
import { WebGLInferenceHandler } from '../inference-handler';
import { Artifact, ProgramInfo, RunData, TextureLayout } from '../types';
export declare class WebGLConv extends Conv {
    run(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): Tensor[];
    createProgramInfos(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[]): ProgramInfo[];
    createRunDatas(inferenceHandler: WebGLInferenceHandler, programInfos: ProgramInfo[], inputs: Tensor[]): RunData[];
    createIm2ColProgramInfo(inferenceHandler: WebGLInferenceHandler, inputs: Tensor[], outputShape: number[]): ProgramInfo;
    createDotProductProgramInfo(inferenceHandler: WebGLInferenceHandler, im2colLayout: TextureLayout, inputs: Tensor[], outputShape: number[]): ProgramInfo;
    static prepKernelForDotProduct(shape: number[], group: number, channels: number, kernel: Float32Array): Float32Array;
    static calcIm2ColDims(inputShape: number[], kernelShape: number[], outputShape: number[], channels?: number): number[];
    static calcOutputShape(inputShape: number[], kernelShape: number[], dilations: number[], adjustPads: number[], strides: number[]): number[];
    protected calcSharedDimReadSize(preferredBatchSize: number, sharedDim: number): number;
    protected calcBlockSize(outputLayout: TextureLayout): [number, number] | undefined;
    protected artifacts: Artifact[];
    protected readSize: number;
    protected blockSize: number;
}
