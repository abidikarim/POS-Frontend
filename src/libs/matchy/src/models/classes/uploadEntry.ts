import { Cell } from "./cell";

export class UploadEntry {
    lines: { [key: string]: Cell }[] = [];
    force_upload: boolean = false

    constructor() { }
}