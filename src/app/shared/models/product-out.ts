import { ProductBase } from "./product-base";

export interface ProductOut extends ProductBase {
    id: string
    image_link: string
}