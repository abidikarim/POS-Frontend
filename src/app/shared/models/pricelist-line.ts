import { PricelistLineBase } from "./pricelist-line-base";
import { ProductOut } from "./product-out";

export interface PricelistLine extends PricelistLineBase {
    id: number;
    product: ProductOut;
    isEdit: boolean
}