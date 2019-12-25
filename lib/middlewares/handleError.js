'use strict';

module.exports = async (ctx, req, next) => {
    try {
        return await next(ctx, req);
    } catch (err) {
        ctx.logger.error("Error in controller", err.stack);
        return err.toHttpResult ? err.toHttpResult() : {
            status: 500,
            body: {
                code: 'INTERNAL_ERROR',
                message: 'N/A'
            },
            headers: null
        };
    }
};