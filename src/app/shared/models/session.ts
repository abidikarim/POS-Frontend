import { EmployeeBase } from "./employee-base";
import { SessionBase } from "./session-base";

export interface Session extends SessionBase {
    id: number;
    employee: EmployeeBase
}