import * as api from '../lib/api';
import { Backend } from '../lib/api';
import { Attribute } from '../lib/attribute';
import { Logger } from '../lib/instrument';
import { Tensor } from '../lib/tensor';
export declare namespace Test {
    interface NamedTensor extends api.Tensor {
        name: string;
    }
    /**
     * This interface represent a value of Attribute. Should only be used in testing.
     */
    interface AttributeValue {
        name: string;
        data: Attribute.DataTypeMap[Attribute.DataType];
        type: Attribute.DataType;
    }
    /**
     * This interface represent a value of Tensor. Should only be used in testing.
     */
    interface TensorValue {
        data: number[];
        dims: number[];
        type: Tensor.DataType;
    }
    /**
     * Represent a string to describe the current environment.
     * Used in ModelTest and OperatorTest to determine whether to run the test or not.
     */
    type Condition = string;
    interface ModelTestCase {
        name: string;
        dataFiles: ReadonlyArray<string>;
        inputs?: NamedTensor[];
        outputs?: NamedTensor[];
    }
    interface ModelTest {
        name: string;
        modelUrl: string;
        backend?: string;
        condition?: Condition;
        cases: ReadonlyArray<ModelTestCase>;
    }
    interface ModelTestGroup {
        name: string;
        tests: ReadonlyArray<ModelTest>;
    }
    interface OperatorTestCase {
        name: string;
        inputs: ReadonlyArray<TensorValue>;
        outputs: ReadonlyArray<TensorValue>;
    }
    interface OperatorTestOpsetImport {
        domain: string;
        version: number;
    }
    interface OperatorTest {
        name: string;
        operator: string;
        opsets?: ReadonlyArray<OperatorTestOpsetImport>;
        backend?: string;
        condition?: Condition;
        attributes: ReadonlyArray<AttributeValue>;
        cases: ReadonlyArray<OperatorTestCase>;
    }
    interface OperatorTestGroup {
        name: string;
        tests: ReadonlyArray<OperatorTest>;
    }
    namespace WhiteList {
        type TestName = string;
        interface TestDescription {
            name: string;
            condition: Condition;
        }
        type Test = TestName | TestDescription;
    }
    /**
     * The data schema of a whitelist file.
     * A whitelist should only be applied when running suite test cases (suite0, suite1)
     */
    interface WhiteList {
        [backend: string]: {
            [group: string]: ReadonlyArray<WhiteList.Test>;
        };
    }
    /**
     * Represent ONNX.js global options
     */
    interface Options {
        debug?: boolean;
        cpu?: Backend.CpuOptions;
        webgl?: Backend.WebGLOptions;
        wasm?: Backend.WasmOptions;
    }
    /**
     * Represent a file cache map that preload the files in prepare stage.
     * The key is the file path and the value is the file content in BASE64.
     */
    interface FileCache {
        [filePath: string]: string;
    }
    /**
     * The data schema of a test config.
     */
    interface Config {
        unittest: boolean;
        op: ReadonlyArray<OperatorTestGroup>;
        model: ReadonlyArray<ModelTestGroup>;
        fileCacheUrls?: ReadonlyArray<string>;
        log: ReadonlyArray<{
            category: string;
            config: Logger.Config;
        }>;
        profile: boolean;
        options: Options;
    }
}
