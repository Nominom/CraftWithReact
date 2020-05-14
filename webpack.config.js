const path = require('path');
module.exports = {
    // define entry file and output
    entry: {
        main: './src/index.js',
    },
    output: {
        path: path.resolve('./web/res'),
        filename: '[name].js'
    },
    // define babel loader
    module: {
        rules: [
            { test: /\.(js|jsx)$/, loader: 'babel-loader', exclude: /node_modules/ }
        ]
    }
};