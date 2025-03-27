import { ProgramType } from "../enums/prgram-type";

export interface ProgramBase {
    name: string;
    description: string;
    program_type: ProgramType;
    start_date: Date | string;
    end_date: Date | string;
    discount?: number
    product_to_buy_id?: number;
    product_to_get_id?: number
    items_count?: number
}