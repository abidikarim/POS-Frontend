import { ProductBase } from "./product-base";

export interface ProductOut extends ProductBase {
    id: number
    image_link: string
}