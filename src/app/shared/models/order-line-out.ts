import { OrderLineBase } from "./order-line-base";

export interface OrderLineOut extends OrderLineBase {
    id: number
    order_id: number
}