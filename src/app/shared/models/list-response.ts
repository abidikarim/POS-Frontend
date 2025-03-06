import { BaseOut } from "./base-out";

export interface ListResponse<T> extends BaseOut {
    list: T[];
}