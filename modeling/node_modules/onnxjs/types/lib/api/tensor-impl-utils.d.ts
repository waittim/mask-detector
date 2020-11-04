import { Tensor as InternalTensor } from '../tensor';
import { Tensor as TensorInterface } from './tensor';
import { Tensor as ApiTensor } from './tensor-impl';
export declare function fromInternalTensor(internalTensor: InternalTensor): ApiTensor;
export declare function toInternalTensor(tensor: ApiTensor): InternalTensor;
export declare function matchElementType(type: TensorInterface.Type, element: TensorInterface.ElementType): void;
export declare function validateIndices(indices: ReadonlyArray<number>): void;
