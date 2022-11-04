export class DatabaseApiRequestDto {
    queries: QueryPayload[]
    source: string
}

export class QueryPayload {
    command: string
    name: string
    parameters?: any
    pagination?: PaginationPayload
}

export class PaginationPayload {
    perPage: number
    currentPage: number
}