import { BaseOut } from "./base-out";

export interface LoginToken extends BaseOut {
    access_token: string;
    token_type: string;
}