/// <reference types="platform" />
import { Backend, Environment, Onnx } from './api';
interface ENV extends Environment {
    readonly onnx: Onnx;
    readonly backend: Backend;
    readonly platform: Platform;
}
export declare const env: ENV;
export {};
