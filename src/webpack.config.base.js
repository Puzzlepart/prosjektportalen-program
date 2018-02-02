var path = require("path"),
    webpack = require('webpack'),
    pkg = require("../package.json"),
    config = require("../.tasks/@configuration.js"),
    BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = (devtool, exclude, env, output = path.join(config.paths.dist, "js")) => ({
    entry: { program: [...config.js.polyfills, './lib/js/index.js'] },
    output: { path: output, filename: "pp.[name].js", libraryTarget: "umd" },
    resolve: { extensions: ['.jsx', '.js', '.json', '.txt'], alias: {} },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["react", "env", "es2015"],
                        plugins: [require("babel-plugin-transform-class-properties"), require("babel-plugin-transform-object-assign")]
                    }
                },
                exclude: exclude
            },
            { test: /\.txt$/, use: 'raw-loader' },
            { test: /\.json$/, loader: "json-loader" }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({ '__VERSION': JSON.stringify(pkg.version) }),
        new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /nb/)
    ]
        .concat(env === "production" ? [
            new webpack.optimize.UglifyJsPlugin({
                mangle: true,
                compress: { warnings: false, pure_getters: true, unsafe: true, unsafe_comps: true, screw_ie8: true },
                output: { comments: false },
            }),
            new webpack.optimize.AggressiveMergingPlugin()
        ] : [])
        .concat(config.useBundleAnalyzer ? [new BundleAnalyzerPlugin({ analyzerMode: 'static' })] : [])
});