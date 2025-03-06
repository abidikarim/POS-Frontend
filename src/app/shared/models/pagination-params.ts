export class PaginationParams {
    page: number;
    limit: number;
    name: string;

    constructor(name: string = "", page: number = 1, limit: number = 10) {
        this.page = page
        this.limit = limit
        this.name = name
    }
}