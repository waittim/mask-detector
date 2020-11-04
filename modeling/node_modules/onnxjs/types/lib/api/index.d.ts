import { Onnx } from './onnx';
import * as onnxImpl from './onnx-impl';
export = onnxImpl;
declare global {
    /**
     * the global onnxjs exported object
     */
    const onnx: Onnx;
}
