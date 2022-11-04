export class DatabaseApiResponseDto {
    successful: boolean
    message: string
    data: {
        [key: string]: any
    }
}