'use strict';

module.exports = async (ctx, req, next) => {
    try {
        return await next(ctx, req);
    } catch (err) {
        let result = {
            status: 500,
            body: {
                code: 'INTERNAL_ERROR',
                message: 'N/A'
            },
            headers: null
        };

        if (err.toHttpResult) {
            ctx.logger.warn("Error in controller", err.stack);
            result = err.toHttpResult();
        } else {
            ctx.logger.error("Error in controller", err.stack);
        }

        return result;
    }
};