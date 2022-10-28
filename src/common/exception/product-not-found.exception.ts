import { NotFoundException } from "@nestjs/common";
import { StatusCode } from "../constants/status-code.enum";

export class ProductNotFoundException extends NotFoundException {
    constructor() {
        super(StatusCode.PRODUCT_NOT_FOUND);
    }
}