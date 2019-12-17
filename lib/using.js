'use.strict';

const path = require('path');

module.exports = (...roots) => {
    const root = path.resolve(...roots);
    global.using = modulePath => require(path.resolve(root, modulePath));    
};
