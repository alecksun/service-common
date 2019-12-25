'use strict';
const uuidV4 = require('uuid/v4');

module.exports = async (ctx, req, next) => {
    const requestId = req.headers['request-id'] || uuidV4();
    ctx = ctx.createContext(null, { RequestId: requestId });
    return next(ctx, req);
};
