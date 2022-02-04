const baseConfig = require('../../jest.base.config');
baseConfig.moduleDirectories = ['dist', 'node_modules'];
module.exports = {
    ...baseConfig,
};
