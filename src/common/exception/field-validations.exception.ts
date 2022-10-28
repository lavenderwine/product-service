import { BadRequestException, ValidationError } from "@nestjs/common";
import { ErrorDto } from "../dto";

export class FieldValidationsException extends BadRequestException {
    constructor(errors: ValidationError[]) {
        const mappedErrors: ErrorDto[] = [];
        errors.forEach(f => {
            const constraints = Object.entries(f.constraints);
            const fieldErrors: ErrorDto[] = constraints.map(([key, message]) => ({
                code: '40002', // TODO: to specify error code per field error
                attribute: f.property,
                message,
            }));
            mappedErrors.push(...fieldErrors);
        });

        super(mappedErrors);
    }
}