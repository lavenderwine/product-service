/**
 * Helper methods and constants for tests
 */

export const apiErrorResponseData = {
    errors: [
        {
            code: "40002",
            attribute: "name",
            message: "name should not be empty"
        },
        {
            code: "40002",
            attribute: "price",
            message: "price must be a positive number"
        },
        {
            code: "40002",
            attribute: "price",
            message: "price must be a number conforming to the specified constraints"
        },
        {
            code: "40002",
            attribute: "price",
            message: "price should not be empty"
        }
    ]
};