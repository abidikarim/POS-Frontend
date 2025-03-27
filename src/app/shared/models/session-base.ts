import { SessionStatus } from "../enums/session-status";

export interface SessionBase {
    id: number;
    opened_at: Date;
    closed_at: Date;
    employee_id: number;
    status: SessionStatus
}