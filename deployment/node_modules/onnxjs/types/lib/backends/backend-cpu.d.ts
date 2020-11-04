import { Backend as BackendInterface } from '../api/onnx';
import { Backend, SessionHandler } from '../backend';
import { Session } from '../session';
declare type CpuOptions = BackendInterface.CpuOptions;
export declare class CpuBackend implements Backend, CpuOptions {
    disabled?: boolean;
    initialize(): boolean;
    createSessionHandler(context: Session.Context): SessionHandler;
    dispose(): void;
}
export {};
