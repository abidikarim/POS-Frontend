export interface PricelistLineBase {
    new_price: number;
    min_quantity: number;
    start_date: Date | string;
    end_date: Date | string;
    pricelist_id: number;
    product_id: number;
}