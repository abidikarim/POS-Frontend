import { OrderBase } from "./order-base";
import { Session } from "./session";

export interface OrderOut extends OrderBase {
    id: number
    session: Session
    created_at: Date
}