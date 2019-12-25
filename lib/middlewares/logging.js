'use strict';

module.exports = async (ctx, req, next) => {
    const start = Date.now();
    const result = await next(ctx, req);
    const end = Date.now();
    const duration = end - start;

    const status = result.status || 200;
    if (status < 400)
        ctx.logger.createLogger({ status, duration }).info("request end");
    else if (status >= 500 || status === 429)
        ctx.logger.createLogger({ status, duration }).error("request end with error");
    else 
        ctx.logger.createLogger({ status, duration }).warn("request end with error");
    return result;
};