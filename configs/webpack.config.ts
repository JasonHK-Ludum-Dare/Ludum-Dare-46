"use strict";

import "webpack-dev-server";

import CopyWebpackPlugin from "copy-webpack-plugin";
import {
    isBoolean,
    isObject,
} from "lodash";
import Path from "path";
import TerserWebpackPlugin from "terser-webpack-plugin";
import TSLoader from "ts-loader";
import Webpack from "webpack";
import WebpackBundleAnalyzer from "webpack-bundle-analyzer";

const DIRECTORY_ROOT = Path.resolve(__dirname, "../");

const DIRECTORY_DIST = Path.resolve(DIRECTORY_ROOT, "./dist");

const DIRECTORY_SRC = Path.resolve(DIRECTORY_ROOT, "./src");
const DIRECTORY_SRC_GAME = Path.resolve(DIRECTORY_SRC, "./game");

function ConfigurationFactory(env: string | Record<string, string | number | boolean> | undefined, argv: Webpack.CliConfigOptions): Webpack.Configuration
{
    if (!isObject(env)) { env = {}; }

    const isProduction: boolean = isBoolean(env.production) ? env.production : false;

    const enableWatch: boolean = isBoolean(env.watch) ? env.watch : false;
    const enableSourceMap: boolean = isBoolean(env.sourceMap) ? env.sourceMap : !isProduction;

    const enableBundleAnalyzer: boolean = isBoolean(env.analyze) ? env.analyze : !isProduction;
    const openBundleAnalyzerReport: boolean = isBoolean(env.openReport) ? env.openReport : false;

    const configuration: Webpack.Configuration = {
        mode: isProduction ? "production" : "development",
        entry: {
            "game": [
                Path.resolve(DIRECTORY_SRC_GAME ,"./index.ts"),
            ],
        },
        output: {
            path: DIRECTORY_DIST,
            filename: "[name].js",
        },
        resolve: {
            extensions: [".ts", ".tsx", ".ejs", ".mjs", ".js"],
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/i,
                    include: [
                        DIRECTORY_SRC_GAME,
                    ],
                    exclude: /node_modules/,
                    loader: "ts-loader",
                    options: {
                        instance: "game",
                        configFile: Path.resolve(DIRECTORY_SRC_GAME, "tsconfig.json"),
                    } as TSLoader.Options,
                },
            ],
        },
        plugins: [
            new Webpack.DefinePlugin(
                {
                    "process.env.NODE_ENV": JSON.stringify("production"),
                }),
            new CopyWebpackPlugin(
                [
                    { from: "src/index.html", to: "index.html" },
                    // { from: "assets/manifest.json", to: "." },
                    // { from: "assets/icons/favicon.ico", to: "." },
                    // {
                    //     from: "assets/icons/",
                    //     to: "icons",
                    //     ignore: ["*.svg", "favicon.ico"],
                    // },
                    // { from: "assets/masks/safari.svg", to: "icons" },
                ]),
        ],
        optimization: {
            minimizer: [
                new TerserWebpackPlugin(
                    {
                        test: /\.m?js$/i,
                    }),
            ],
        },
        watch: enableWatch,
        devServer: {
            //host: "0.0.0.0",
            port: 2004,
            contentBase: DIRECTORY_DIST,
            inline: true,
        },
    };

    if (enableBundleAnalyzer)
    {
        configuration.plugins!.push(
            new WebpackBundleAnalyzer.BundleAnalyzerPlugin(
                {
                    analyzerMode: "static",
                    openAnalyzer: openBundleAnalyzerReport,
                }));
    }

    if (enableSourceMap)
    {
        configuration.module!.rules.push(
            {
                enforce: "pre",
                test: /\.js$/i,
                loader: "source-map-loader",
            });

        configuration.devtool = "source-map";
    }

    return configuration;
}

export = ConfigurationFactory;
