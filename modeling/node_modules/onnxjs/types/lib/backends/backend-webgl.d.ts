import { Backend as BackendInterface } from '../api/onnx';
import { Backend, SessionHandler } from '../backend';
import { Session } from '../session';
import { WebGLContext } from './webgl/webgl-context';
declare type WebGLOptions = BackendInterface.WebGLOptions;
/**
 * WebGLBackend is the entry point for all WebGL opeartions
 * When it starts it created the WebGLRenderingContext
 * and other main framework components such as Program and Texture Managers
 */
export declare class WebGLBackend implements Backend, WebGLOptions {
    disabled?: boolean;
    glContext: WebGLContext;
    contextId?: 'webgl' | 'webgl2';
    matmulMaxBatchSize?: number;
    textureCacheMode?: 'initializerOnly' | 'full';
    initialize(): boolean;
    createSessionHandler(context: Session.Context): SessionHandler;
    dispose(): void;
}
export {};
