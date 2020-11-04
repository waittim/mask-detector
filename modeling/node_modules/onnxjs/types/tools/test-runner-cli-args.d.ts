import { Backend } from '../lib/api';
import { Test } from '../test/test-types';
export declare namespace TestRunnerCliArgs {
    type Mode = 'suite0' | 'suite1' | 'model' | 'unittest' | 'op';
    type Backend = 'cpu' | 'webgl' | 'wasm' | 'onnxruntime';
    type Environment = 'chrome' | 'edge' | 'firefox' | 'electron' | 'safari' | 'node' | 'bs';
    type BundleMode = 'prod' | 'dev' | 'perf';
}
export interface TestRunnerCliArgs {
    debug: boolean;
    mode: TestRunnerCliArgs.Mode;
    /**
     * The parameter that used when in mode 'model' or 'op', specifying the search string for the model or op test
     */
    param?: string;
    backends: [TestRunnerCliArgs.Backend];
    env: TestRunnerCliArgs.Environment;
    /**
     * Bundle Mode
     *
     * this field affects the behavior of Karma and Webpack.
     *
     * For Karma, if flag '--bundle-mode' is not set, the default behavior is 'dev'
     * For Webpack, if flag '--bundle-mode' is not set, the default behavior is 'prod'
     *
     * For running tests, the default mode is 'dev'. If flag '--perf' is set, the mode will be set to 'perf'.
     *
     * Mode   | Output File        | Main                 | Source Map         | Webpack Config
     * ------ | ------------------ | -------------------- | ------------------ | --------------
     * prod   | /dist/onnx.min.js  | /lib/api/index.ts    | source-map         | production
     * dev    | /test/onnx.dev.js  | /test/test-main.ts   | inline-source-map  | development
     * perf   | /test/onnx.perf.js | /test/test-main.ts   | (none)             | production
     */
    bundleMode: TestRunnerCliArgs.BundleMode;
    logConfig: Test.Config['log'];
    /**
     * Whether to enable InferenceSession's profiler
     */
    profile: boolean;
    /**
     * Whether to enable file cache
     */
    fileCache: boolean;
    /**
     * Specify the times that test cases to run
     */
    times?: number;
    cpuOptions?: Backend.CpuOptions;
    wasmOptions?: Backend.WasmOptions;
    webglOptions?: Backend.WebGLOptions;
    noSandbox?: boolean;
}
export declare function parseTestRunnerCliArgs(cmdlineArgs: string[]): TestRunnerCliArgs;
