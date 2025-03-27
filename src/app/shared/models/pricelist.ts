import { PricelistBase } from "./pricelist-base";
import { PricelistLine } from "./pricelist-line";

export interface PriceList extends PricelistBase {
    id: number;
    pricelist_lines: PricelistLine[]
}