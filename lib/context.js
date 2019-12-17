"use strict";

class Context {
    constructor(logger, metadata = {}) {
        this.metadata = { ...metadata };
        this.logger = logger;
    }

    createContext(metadata, loggerMetadata) {
        let logger = this.logger;
        if (loggerMetadata)
            logger = logger.createLogger(loggerMetadata);
        if (!metadata)
            metadata = this.metadata;
        else 
            metadata = { ...this.metadata, ...metadata }
        return new Context(logger, metadata);
    }

    get(key) {
        return this.metadata[key];
    }
};

module.exports = Context;
