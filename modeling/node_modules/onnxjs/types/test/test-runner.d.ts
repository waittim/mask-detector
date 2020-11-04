import * as api from '../lib/api';
import { InferenceHandler, SessionHandler } from '../lib/backend';
import { Profiler } from '../lib/instrument';
import { Operator } from '../lib/operators';
import { Tensor } from '../lib/tensor';
import { Test } from './test-types';
/**
 * a ModelTestContext object contains all states in a ModelTest
 */
export declare class ModelTestContext {
    readonly session: api.InferenceSession;
    readonly backend: string;
    readonly perfData: ModelTestContext.ModelTestPerfData;
    private readonly profile;
    private constructor();
    /**
     * dump the current performance data
     */
    private logPerfData;
    release(): void;
    /**
     * create a ModelTestContext object that used in every test cases in the given ModelTest.
     */
    static create(modelTest: Test.ModelTest, profile: boolean): Promise<ModelTestContext>;
    /**
     * set the global file cache for looking up model and tensor protobuf files.
     */
    static setCache(cache: Test.FileCache): void;
    private static initializing;
    private static cache;
}
export declare namespace ModelTestContext {
    interface ModelTestPerfData {
        init: number;
        firstRun: number;
        runs: number[];
        count: number;
    }
}
/**
 * run a single model test case. the inputs/outputs tensors should already been prepared.
 */
export declare function runModelTestSet(context: ModelTestContext, testCase: Test.ModelTestCase): Promise<void>;
/**
 * a OpTestContext object contains all states in a OpTest
 */
export declare class OpTestContext {
    protected opTest: Test.OperatorTest;
    static profiler: Profiler;
    readonly backendHint: string;
    sessionHandler: SessionHandler;
    inferenceHandler: InferenceHandler;
    constructor(opTest: Test.OperatorTest);
    createOperator(): Operator;
    dispose(): void;
    init(): Promise<void>;
}
/**
 * run a single operator test case.
 */
export declare function runOpTest(testcase: Test.OperatorTestCase, context: OpTestContext): Promise<void>;
export declare class TensorResultValidator {
    private readonly absoluteThreshold;
    private readonly relativeThreshold;
    private readonly maxFloatValue;
    private static isHalfFloat;
    constructor(backend: string);
    checkTensorResult(actual: Tensor[], expected: Tensor[]): void;
    checkApiTensorResult(actual: api.Tensor[], expected: api.Tensor[]): void;
    checkNamedTensorResult(actual: ReadonlyMap<string, api.Tensor>, expected: Test.NamedTensor[]): void;
    areEqual(actual: Tensor, expected: Tensor): boolean;
    strictEqual<T>(actual: T, expected: T): boolean;
    floatEqual(actual: number[] | Float32Array | Float64Array, expected: number[] | Float32Array | Float64Array): boolean;
    integerEqual(actual: number[] | Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array, expected: number[] | Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array): boolean;
}
