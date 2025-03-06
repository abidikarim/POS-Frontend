import { EmployeeBase } from "./employee-base";

export interface EmployeeEdit extends EmployeeBase {
    password: string | undefined;
    confirm_password: string | undefined
}