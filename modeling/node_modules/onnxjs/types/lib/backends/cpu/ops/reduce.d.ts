import { ReduceBase } from '../../../ops/reduce-op';
import { Tensor } from '../../../tensor';
import { CpuInferenceHandler } from '../inference-handler';
export declare class CpuReduceSum extends ReduceBase {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[] | Promise<Tensor[]>;
}
export declare class CpuReduceSumSquare extends ReduceBase {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
export declare class CpuReduceLogSum extends ReduceBase {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
export declare class CpuReduceMax extends ReduceBase {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
export declare class CpuReduceMin extends ReduceBase {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
export declare class CpuReduceMean extends ReduceBase {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
export declare class CpuReduceProd extends ReduceBase {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
export declare function reduceSum(input: Tensor, axes: number[], keepDims: boolean): Tensor;
export declare function reduceSumSquare(input: Tensor, axes: number[], keepDims: boolean): Tensor;
export declare function reduceLogSum(input: Tensor, axes: number[], keepDims: boolean): Tensor;
export declare function reduceMax(input: Tensor, axes: number[], keepDims: boolean): Tensor;
export declare function reduceMin(input: Tensor, axes: number[], keepDims: boolean): Tensor;
export declare function reduceMean(input: Tensor, axes: number[], keepDims: boolean): Tensor;
export declare function reduceProd(input: Tensor, axes: number[], keepDims: boolean): Tensor;
