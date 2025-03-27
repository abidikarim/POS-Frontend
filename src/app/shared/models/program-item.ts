import { Status } from "../enums/status";

export interface ProgramItem {
    id: number
    code: string;
    program_id: number;
    status: Status
}