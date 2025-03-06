import { PaginationParams } from "./pagination-params";

export class ProductFilter extends PaginationParams {
    category: string;
    min_price: number;
    max_price: number;
    min_quantity: number;
    max_quantity: number;
    constructor(page: number = 1, limit: number = 10, name: string = '', cat: string = '', min_p: number = 0, max_p: number = 0, min_q: number = 0, max_q: number = 0) {
        super(name, page, limit)
        this.category = cat
        this.min_price = min_p
        this.max_price = max_p
        this.min_quantity = min_q
        this.max_quantity = max_q
    }
}