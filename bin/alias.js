/**
 * Created by caoxifeng on.
 */

var path = require('path');
var containerPath = path.resolve('./');

//	别名
var alias = {
    config: path.resolve(containerPath, './src/config/config.js'),
    action: path.resolve(containerPath, './src/actions/'),
    api: path.resolve(containerPath, './src/api/'),
    components: path.resolve(containerPath, './src/components/'),
    constants: path.resolve(containerPath, './src/constants/'),
    containers: path.resolve(containerPath, './src/containers/'),
    lib: path.resolve(containerPath, './src/lib/'),
    utils: path.resolve(containerPath, './src/utils/')
};
module.exports = alias;
