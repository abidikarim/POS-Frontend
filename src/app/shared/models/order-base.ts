import { OrderLineBase } from "./order-line-base"

export interface OrderBase {
    number: string
    total_price: number
    customer_id?: number
    session_id: number
    pricelist_id?: number
    program_item_id?: number
    lines: OrderLineBase[]
}
