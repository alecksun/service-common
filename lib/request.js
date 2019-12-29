'use strict';
const request = require('request');

class Request {
    constructor(logger) {
        this.logger = logger
        this.promise = Promise.resolve();
    }

    url(value) {
        const setValue = value => this._url = value;
        if (value instanceof Promise)
            this.promise = this.promise.then(value).then(setValue);
        else 
            setValue(value);

        return this;
    }

    method(value) {
        const setValue = value => this._method = value;
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
        const setValue = value => this._headers = { ...this._headers, ...value };
        if (value instanceof Promise)
            this.promise = this.promise.then(() => value).then(setValue);
        else 
            setValue(value);

        return this;
    }

    streaming() {
        this._streaming = true;
        return this;
    }

    async send(body, json = false) {
        await this.promise;
        const start = Date.now();
        return new Promise((resolve, reject) => {
            if (this._streaming) {
                request({
                    method: this._method,
                    url: this._url,
                    headers: this._headers,
                    body,
                    json
                }).on('response', response => {
                    response.on('end', () => {
                        const end = Date.now();
                        const duration = end - start;

                        this.logger.createLogger({
                            method: this._method,
                            url: this._url,
                            duration,
                            response_status: response.statusCode
                        }).info('external request')
                    });
                    resolve({
                        status: response.statusCode,
                        headers: response.headers,
                        body: response
                    });
                }).on('error', error => {
                    const end = Date.now();
                    const duration = end - start;

                    this.logger.createLogger({
                        method: this._method,
                        url: this._url,
                        duration,
                        error: error
                    }).info('external request')
                });
                return;
            }

            request({
                method: this._method,
                url: this._url,
                headers: this._headers,
                body,
                json
            }, (error, response, body) => {
                const end = Date.now();
                const duration = end - start;

                if (error) {
                    reject(error);
                    this.logger.createLogger({
                        method: this._method,
                        url: this._url,
                        duration,
                        error: error
                    }).info('external request')
                    return;
                }

                this.logger.createLogger({
                    method: this._method,
                    url: this._url,
                    duration,
                    response_status: response.statusCode
                }).info('external request')

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
