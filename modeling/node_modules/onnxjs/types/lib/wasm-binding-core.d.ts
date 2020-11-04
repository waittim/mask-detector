export interface WasmCallArgumentTypeMap {
    bool: boolean;
    int32: number;
    float32: number;
    float64: number;
    boolptr: ReadonlyArray<boolean> | Uint8Array;
    int32ptr: ReadonlyArray<number> | Uint32Array | Int32Array | null;
    float32ptr: ReadonlyArray<number> | Int32Array | Uint32Array | Float32Array | null;
    float64ptr: ReadonlyArray<number> | Float64Array | null;
}
export declare type WasmCallArgumentType = keyof WasmCallArgumentTypeMap;
export declare type WasmCallArgumentDataType = WasmCallArgumentTypeMap[WasmCallArgumentType];
export declare type WasmCallArgumentPass = 'in' | 'out' | 'inout';
export declare type WasmCallArgument = [WasmCallArgumentDataType, WasmCallArgumentType, WasmCallArgumentPass?];
export interface PerformanceData {
    startTime?: number;
    endTime?: number;
    startTimeFunc?: number;
    endTimeFunc?: number;
}
/**
 * initialize the WASM instance.
 *
 * this function should be called before any other calls to the WASM binding.
 */
export declare function init(): Promise<void>;
export declare class WasmBinding {
    protected ptr8: number;
    protected numBytesAllocated: number;
    protected constructor();
    /**
     * ccall in current thread
     * @param functionName
     * @param params
     */
    ccall(functionName: string, ...params: WasmCallArgument[]): PerformanceData;
    ccallRaw(functionName: string, data: Uint8Array): PerformanceData;
    protected func(functionName: string, ptr8: number): void;
    static calculateOffsets(offset: number[], params: WasmCallArgument[]): number;
    static ccallSerialize(heapU8: Uint8Array, offset: number[], params: WasmCallArgument[]): void;
    static ccallDeserialize(buffer: Uint8Array, offset: number[], params: WasmCallArgument[]): void;
    private expandMemory;
    dispose(): void;
}
/**
 * returns a number to represent the current timestamp in a resolution as high as possible.
 */
export declare const now: () => number;
