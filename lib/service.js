'use strict';


const serviceRegistry = {}
const __services = {}

const register = (name, createService, dependencies = []) => {
    if (serviceRegistry[name]) {
        throw new Error(`Service ${name} already registered`);
    } 

    serviceRegistry[name] = {
        createService,
        dependencies
    };
}

const initService = async serviceName => {
    if (__services[serviceName])
        return;

    const service = serviceRegistry[serviceName];
    if (service.initializing)
        throw new Error('Circular dependencies found when initializing services');
    service.initializing = true;

    const dependencies = [];
    for (const dep of service.dependencies) {
        dependencies.push(await initService(dep));
    }

    __services[serviceName] = await service.createService(...dependencies);
    service.initializing = false;

    return __services[serviceName];
}

const init = async () => {
    const stack = [];

    // build a service initializing sequence via a tree
    const serviceNames = Object.keys(serviceRegistry);

    while(serviceNames.length) {
        const serviceName = serviceNames.shift();
        await initService(serviceName);
    }
}

const get = name => {
    return __services[name];
};

module.exports = {
    register,
    init,
    get
};
