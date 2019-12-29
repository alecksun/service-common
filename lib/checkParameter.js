'use strict';

class BadRequestError extends Error {
    constructor(title) {
        super(title);
    }

    toHttpResult() {
        return {
            status: 400,
            body: {
                code: 'BAD_REQUEST',
                title: this.title
            }
        }
    }
}

module.exports = message => value => {
    const throwError = () => { throw new BadRequestError(message) };
    const exist = () => (value !== undefined && value !== null) || throwError(message);
    const toBe = target => value === target;
    const match = rexValidate => rexValidate.test(value) || throwError(message);
    const validate = validator => validator(value) || throwError(message);
    const validate_async = async validator => (await validator(value)) || throwError(message);
    return {
        exist,
        toBe,
        match,
        validate,
        validate_async
    };
}