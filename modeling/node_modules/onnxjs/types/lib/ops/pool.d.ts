import { Attribute } from '../attribute';
import { InferenceHandler } from '../backend';
import { Operator } from '../operators';
import { Tensor } from '../tensor';
declare class PoolBase {
    checkInputs(inputs: Tensor[]): boolean;
    protected checkInputTypes(inputs: Tensor[]): boolean;
    protected autoPad: string;
    protected ceilMode: number;
    protected countIncludePad: boolean;
    protected kernelShape: number[];
    protected strides: number[];
    protected pads: number[];
}
export declare abstract class AveragePool extends PoolBase implements Operator {
    abstract run(inferenceHandler: InferenceHandler, inputs: Tensor[]): Tensor[] | Promise<Tensor[]>;
    initialize(attributes: Attribute): void;
}
export declare abstract class GlobalAveragePool extends PoolBase implements Operator {
    abstract run(inferenceHandler: InferenceHandler, inputs: Tensor[]): Tensor[] | Promise<Tensor[]>;
    initialize(attributes: Attribute): void;
}
export declare abstract class MaxPool extends PoolBase implements Operator {
    abstract run(inferenceHandler: InferenceHandler, inputs: Tensor[]): Tensor[] | Promise<Tensor[]>;
    initialize(attributes: Attribute): void;
    protected storageOrder: number;
}
export declare abstract class GlobalMaxPool extends PoolBase implements Operator {
    abstract run(inferenceHandler: InferenceHandler, inputs: Tensor[]): Tensor[] | Promise<Tensor[]>;
    initialize(attributes: Attribute): void;
}
export {};
