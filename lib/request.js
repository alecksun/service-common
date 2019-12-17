'use strict';
const request = require('request');

class Request {
    constructor(logger) {
        this.logger = logger
        this.promise = Promise.resolve();
    }

    url(value) {
        const setValue = value => this.url = value;
        if (value instanceof Promise)
            this.promise = this.promise.then(value).then(setValue);
        else 
            setValue(value);

        return this;
    }

    method(value) {
        const setValue = value => this.method = value;
        if (value instanceof Promise)
            this.promise = this.promise.then(value).then(setValue);
        else 
            setValue(value);

        return this;
    }

    get() {
        return this.method('GET');
    }

    post() {
        return this.method('POST');
    }

    put() {
        return this.method('PUT');
    }

    headers(value) {
        const setValue = value => this.headers = { ...this.headers, ...value };
        if (value instanceof Promise)
            this.promise = this.promise.then(value).then(setValue);
        else 
            setValue(value);

        return this;
    }

    send(body, json = false) {
        return new Promise((resolve, reject) => {
            request({
                method: this.method,
                url: this.url,
                headers: this.headers,
                body,
                json
            }, (error, response, body) => {
                if (error) {
                    reject(error);
                    return;
                }

                resolve({
                    status: response.statusCode,
                    headers: response.headers,
                    body
                });
            });
        });
    }

    json(body) {
        return this.send(body, true);
    }
}

module.exports = logger => new Request(logger);
