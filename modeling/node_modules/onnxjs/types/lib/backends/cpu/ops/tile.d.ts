import { Tile } from '../../../ops/tile';
import { Tensor } from '../../../tensor';
import { CpuInferenceHandler } from '../inference-handler';
export declare class CpuTile extends Tile {
    run(inferenceHandler: CpuInferenceHandler, inputs: Tensor[]): Tensor[] | Promise<Tensor[]>;
}
export declare function tile(x: Tensor, repeats: Tensor): Tensor;
