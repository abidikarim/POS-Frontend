import { ProductOut } from "./product-out";
import { ProgramBase } from "./program-base";
import { ProgramItem } from "./program-item";

export interface Program extends ProgramBase {
    id: number
    items: ProgramItem[]
    product_to_buy: ProductOut
    product_to_get: ProductOut
}