'use strict';

module.exports = message => value => {
    const throwError = () => { throw new Error(message) };
    const exist = () => (value !== undefined && value !== null) || throwError(message);
    const regexValidate = validate => validate.test(value) || throwError(message);
    return {
        exist,
        regexValidate
    };
}