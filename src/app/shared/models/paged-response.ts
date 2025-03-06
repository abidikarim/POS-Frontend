import { ListResponse } from "./list-response"

export interface PagedResponse<T> extends ListResponse<T> {
    page_number: number
    page_size: number
    total_pages: number
    total_records: number
}