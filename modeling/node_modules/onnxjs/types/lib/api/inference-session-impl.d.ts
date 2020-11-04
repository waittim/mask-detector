import { Session } from '../session';
import { InferenceSession as InferenceSessionInterface } from './inference-session';
declare type InputType = InferenceSessionInterface.InputType;
declare type RunOptions = InferenceSessionInterface.RunOptions;
declare type OutputType = InferenceSessionInterface.OutputType;
export declare class InferenceSession implements InferenceSessionInterface {
    session: Session;
    constructor(config?: InferenceSessionInterface.Config);
    loadModel(uri: string): Promise<void>;
    loadModel(blob: Blob): Promise<void>;
    loadModel(buffer: ArrayBuffer, byteOffset?: number, length?: number): Promise<void>;
    loadModel(buffer: Uint8Array): Promise<void>;
    run(inputFeed: InputType, options?: RunOptions): Promise<OutputType>;
    startProfiling(): void;
    endProfiling(): void;
}
export {};
