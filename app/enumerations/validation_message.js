export const SHOULD_BE_STRONG = (rules) => {
    return `should be strong. rules are: ${rules.join(", ")}`
}

export default {
    IS_REQUIRED                 : "is required",
    IS_INCORRECT                : "is incorrect",
    SHOULD_BE_EMAIL             : "should be a valid email",
    SHOULD_BE_PHONE             : "should be a valid phone number",
    SHOULD_BE_BOOLEAN           : "should be a boolean",
    SHOULD_BE_DATE              : "should be a date",
    SHOULD_BE_BEFORE            : (date) => { return `should be before ${date}` },
    SHOULD_BE_AFTER             : (date) => { return `should be after ${date}` },
    SHOULD_BE_INTEGER           : "should be an integer",
    SHOULD_BE_STRING            : "should be a string",
    SHOULD_BE_FLOAT             : "should be a float",
    SHOULD_BE_ARRAY             : "should be an array",
    SHOULD_BE_OBJECT            : "should be an object",
    SHOULD_BE_NULL              : "should be null",
    SHOULD_BE_BETWEEN_CHARS     : (min, max) => { return `should be between ${min} and ${max} characters long` },
    SHOULD_BE_AT_LEAST          : (min) => { return `should be at least ${min} characters long` },
    SHOULD_BE_AT_MOST           : (max) => { return `should be at most ${max} characters long` },
    SHOULD_BE_GREATER_THAN_OR_EQ: (num) => { return `should be greater than or equals ${num}` },
    SHOULD_BE_STRONG_DEFAULT    : SHOULD_BE_STRONG(["at least 8 characters long", "at least 1 lowercase character", "at least 1 uppercase character", "at least 1 number", "at least 1 symbol"]),
    SHOULD_BE_EQUAL_TO          : (equals) => { return `should be equal to ${equals}` },
    SHOULD_BE_ONE_OF            : (values) => { return `should be one of the following values: [${values.join(", ")}]` },
    SHOULD_NOT_BE_PROVIDED      : "should not be provided",
    IS_REQUIRED_IF              : (condition) => { return `is required if ${condition}` },
    SHOULD_NOT_BE_PROVIDED_IF   : (condition) => { return `should not be provided if ${condition}` }
}
