import { PaginationParams } from "./pagination-params";

export class OrderFilter extends PaginationParams {
    ref?: number
    session_id?: number
    number?: string
    constructor(name: string = "", page: number = 1, limit: number = 10, ref: number = 0, session_id: number = 0, number: string = "") {
        super(name, page, limit)
        this.ref = ref
        this.session_id = session_id
        this.number = number
    }
}