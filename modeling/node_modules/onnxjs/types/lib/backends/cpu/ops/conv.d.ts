import { Conv } from '../../../ops/conv';
import { Tensor } from '../../../tensor';
import { CpuInferenceHandler } from '../inference-handler';
export declare class CpuConv extends Conv {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[];
}
export declare function conv2d(Y: Tensor, X: Tensor, W: Tensor, B: Tensor | undefined, dilations: ReadonlyArray<number>, group: number, pads: ReadonlyArray<number>, strides: ReadonlyArray<number>): void;
