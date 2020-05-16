'use strict';

module.exports = {
    devtool: 'eval-source-map',
    entry: {
        js:  ['./hosted/.tmp/scripts/scripts.js','./hosted/.tmp/styles/main.css']
    },
    output: {
        path: __dirname + '/hosted',
        filename: 'dcae-bundle.js'
    },
    module: {
        rules: [
            {test: /\.(js|jsx)$/, loaders: ['babel-loader'], exclude: /node_modules/},
            {test: /\.css$/, loader: "style-loader!css-loader"},
        ]
    }
};
