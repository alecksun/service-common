'use strict';
const stream = require('stream')

const createRoutingGroup = (ctx, application, inheretedMiddleWare = undefined) => {
    let _middleware = inheretedMiddleWare;

    const compositMiddlewares = middlewares => {
        if (middlewares.length === 1)
            return middlewares[0];
        else {
            middlewares = [...middlewares];
            const middleware = middlewares.pop();

            return (ctx, req, next) => middleware(ctx, req, (ctx, req) => compositMiddlewares(middlewares)(ctx, req, next));
        }
    };

    const useMiddlewares = middlewares => {
        if (!middlewares.length)
            return controller => controller;

        let middleware = compositMiddlewares(middlewares);
        return controller => (ctx, req) => middleware(ctx, req, controller);
    }

    const streaming = (res, stream) => {
        stream.on('data', data => {
            res.write(data);
        });

        stream.on('end', () => {
            res.end();
        });

        stream.on('error', (err) => {
            ctx.logger.error(err);
            res.end();
        });
    }

    const route = (httpMethod, name, url, controller, middlewares = []) => {
        middlewares = [...middlewares];
        if (_middleware) middlewares.push(_middleware);

        controller = useMiddlewares(middlewares)(controller);
        application[httpMethod].call(application, url, async (req, res) => {
            ctx = ctx.createContext(null, { ControllerName: name});
            const result = await controller(ctx, req);
            res.status(result.status || 200);
            if (result.headers) res.set(result.headers);
            if (result.cookies) result.cookies.forEach(cookie => res.cookie(cookie.name, cookie.value, cookie.options));
            if (result.body instanceof String || result.body instanceof Buffer) {
                res.write(result.body);
                res.end();
            } else if (result.body instanceof stream.Readable) {
                streaming(res, result.body);
            } else
                res.json(result.body);
        });
    };

    const use = middleware => {
        if (!_middleware) 
            _middleware = middleware;
        else
            _middleware = compositMiddlewares([middleware, _middleware]);
    };

    const createSubgroup = ctx => {
        return createRoutingGroup(ctx, application, _middleware);

    }

    return {
        route,
        use,
        createSubgroup
    };
};

module.exports = createRoutingGroup;

