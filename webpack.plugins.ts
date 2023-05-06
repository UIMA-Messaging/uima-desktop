import type IForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import DotenvWebpackPlugin from 'dotenv-webpack'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ForkTsCheckerWebpackPlugin: typeof IForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

export const plugins = [
	new ForkTsCheckerWebpackPlugin({
		logger: 'webpack-infrastructure',
	}),
	new DotenvWebpackPlugin({
		path: './.env',
	}),
]
