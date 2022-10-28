import { ErrorDto } from "./error.dto"

export class ApiResponseDto<T> {
    message?: string
    data?: T
    errors?: ErrorDto
}