import { ContractType } from "../enums/contract-type"
import { Gender } from "../enums/gender"
import { Role } from "../enums/role"
import { ListResponse } from "./list-response"

export interface EmployeeBase {
    id: number;
    first_name: string
    last_name: string
    email: string
    number: number
    birth_date: string | undefined
    address: string | undefined
    cnss_number: string | undefined
    contract_type: ContractType
    gender: Gender
    roles: ListResponse<Role>
    phone_number: string | undefined
    account_status: string
}