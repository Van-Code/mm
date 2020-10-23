const path = require('path');

const webpack = require('webpack');
const SHARED = '../shared/src/';
const CDNAPP = '../common/src/';
const MMBASE = '../mymag/src/';
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
	transpileDependencies: [ 'vuetify' ],
	outputDir: 'dist',
	indexPath: '../index.html',
	publicPath: process.env.NODE_ENV === 'production' ? './dist' : '/programs/kroger/mymag',
	runtimeCompiler: true, //for compiling recipe detail
	chainWebpack: (config) => {
		config.plugin('html').tap((args) => {
			args[0].template = path.join(__dirname, 'index.template.html');
			return args;
		});
		//configure inline svgs for template
		const svgRule = config.module.rule('svg');
		svgRule.uses.clear();
		svgRule.use('svg-url-loader').loader('svg-url-loader').end();
		//end
		//config.optimization.delete('splitChunks');
	},
	filenameHashing: false,
	devServer: {
		proxy: 'http://localhost'
	},
	css: {
		extract: false, //don't create separate css bundle
		loaderOptions: {
			scss: {
				prependData: '@import "~@/assets/css/_variables.scss";'
			}
		}
	},
	productionSourceMap: false, //no source maps
	configureWebpack: {
		optimization: {
			splitChunks: {
				name: true,
				chunks: 'all',
				cacheGroups: {
					vendors: {
						test: /[\\/]node_modules[\\/]/,
						priority: -10,
						filename: 'vendors.bundle.js'
					},
					default: {
						priority: -20,
						name: 'dist/bundle'
					}
				}
			}
			//splitChunks: false
		},
		output: {
			filename: 'bundle.js'
		},
		resolve: {
			alias: {
				vue: path.resolve('./node_modules/vue'), //fixes attrs readonly
				mmbase: path.resolve(__dirname, MMBASE),
				shared: path.resolve(__dirname, SHARED),
				cdnapp: path.resolve(__dirname, SHARED),
				'@': path.resolve('./src')
			}
		},
		plugins: [
			new webpack.optimize.LimitChunkCountPlugin({
				maxChunks: 2
			})
			//new BundleAnalyzerPlugin()
		]
	}
};
