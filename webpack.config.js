const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { webpack, DefinePlugin } = require("webpack");

module.exports = {
	entry: path.resolve(__dirname, "src/index.tsx"),
	output: {
		publicPath: '/',
		path: path.resolve(__dirname, "build"),
		filename: "bundle.js",
		clean: true,
	},
	devServer: {
		port: 7070,
		open: true,
		hot: true,
		historyApiFallback: true,
		static: {
			directory: path.resolve(__dirname, "dist"),
		}
	},
	resolve: {
		modules: [path.join(__dirname, "src"), "node_modules"],
		alias: {
			react: path.join(__dirname, "node_modules", "react"),
		},
		extensions: [".tsx", ".ts", ".js", ".jsx"]
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: "index.html",
			template: "./src/index.html",
			inject: true,
			env: process.env.YMAP_TOKEN
		}),
		new DefinePlugin({
			"process.env.WEATHER_TOKEN": JSON.stringify(process.env.WEATHER_TOKEN),
			"process.env.YMAP_TOKEN": JSON.stringify(process.env.YMAP_TOKEN),
		})
	],
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/,
				exclude: /node_modules/,
				use: "ts-loader",
			},
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: [
							"@babel/preset-env",
							"@babel/preset-react",
							"@babel/preset-typescript",
						],
					},
				},
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(woff|woff2)$/i,
				type: "asset/resource",
			},
		]
	}
};