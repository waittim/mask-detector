import { Tensor as InternalTensor } from '../tensor';
import { Tensor as TensorInterface } from './tensor';
declare type DataType = TensorInterface.DataType;
declare type Type = TensorInterface.Type;
declare type ElementType = TensorInterface.ElementType;
export declare class Tensor implements TensorInterface {
    internalTensor: InternalTensor;
    constructor(data: DataType | number[] | boolean[], type: Type, dims?: ReadonlyArray<number>);
    dims: ReadonlyArray<number>;
    type: Type;
    size: number;
    data: DataType;
    get(...indices: number[]): ElementType;
    get(indices: ReadonlyArray<number>): ElementType;
    set(value: ElementType, ...indices: number[]): void;
    set(value: ElementType, indices: ReadonlyArray<number>): void;
}
export {};
