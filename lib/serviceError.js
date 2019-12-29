'use strict';

class ServiceError extends Error {
    constructor(status, code, title) {
        super(title);
        this._status = status;
        this._code = code;
    }

    toHttpResult() {
        return {
            status: this._status,
            body: {
                code: this._code,
                title: this.title
            }
        }
    }

    valueOf() {
        return super.valueOf() +
            `\nstatus = ${this.status}` +
            `\ncode = ${this.code}`
    }
}

module.exports = ServiceError;
