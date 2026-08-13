/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check
'use strict';

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

const path = require('path');

/** @type WebpackConfig */
const clientConfig = {
	context: path.join(__dirname, 'client'),
	mode: 'none',
	target: 'webworker', // web extensions run in a webworker context
	entry: {
		main: './src/main.ts',
	},
	output: {
		filename: '[name].js',
		path: path.join(__dirname, 'client', 'dist'),
		libraryTarget: 'commonjs',
		devtoolModuleFilenameTemplate: '../[resource-path]',
	},
	resolve: {
		mainFields: ['module', 'main'],
		extensions: ['.ts', '.js'], // support ts-files and js-files
		alias: {},
		fallback: {
			path: require.resolve('path-browserify'),
		},
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
					},
				],
			},
			{
				resourceQuery: /raw/,
				type: 'asset/source',
			},
		],
	},
	externals: {
		vscode: 'commonjs vscode', // ignored because it doesn't exist
	},
	performance: {
		hints: false,
	},
	devtool: 'nosources-source-map',
};

/** @type WebpackConfig */
const serverConfig = {
	context: path.join(__dirname, 'server'),
	mode: 'none',
	target: 'webworker', // web extensions run in a webworker context
	entry: {
		main: './src/main.ts',
	},
	output: {
		filename: '[name].js',
		path: path.join(__dirname, 'server', 'dist'),
		libraryTarget: 'var',
		library: 'serverExportVar',
		devtoolModuleFilenameTemplate: '../[resource-path]',
	},
	resolve: {
		mainFields: ['module', 'main'],
		extensions: ['.ts', '.js'], // support ts-files and js-files
		alias: {
			'@utils': path.resolve(__dirname, "./server/src/utils"),
			'locutus/php/strings': path.resolve(__dirname, "node_modules/locutus/php/strings/index.js"),
			'locutus/php/array': path.resolve(__dirname, "node_modules/locutus/php/array/index.js"),
		},
		fallback: {
			//path: require.resolve("path-browserify")
		},
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							/**
							 * @param {import('typescript').Program} program 
							 * @returns 
							 */
							getCustomTransformers: (program) => ({
								before: [interfaceTransformer(program)],
							}),
						},
					},
				],
			},
			{
				resourceQuery: /raw/,
				type: 'asset/source',
			},
		],
	},
	externals: {
		vscode: 'commonjs vscode', // ignored because it doesn't exist
	},
	performance: {
		hints: false,
	},
	devtool: 'nosources-source-map',
};

module.exports = [clientConfig, serverConfig];

const ts = require("typescript");

/**
 * @param {ts.Program} program 
 * @returns {ts.TransformerFactory<ts.SourceFile>}
 */
function interfaceTransformer(program) {
  const checker = program.getTypeChecker();

  return (/** @type {ts.TransformationContext} */ context) => (/** @type {ts.SourceFile} */ sourceFile) => {
    /**
     * @param {ts.Node} node
     * @returns {ts.Node}
     */
    const visitor = (node) => {
      if (ts.isClassDeclaration(node) && node.heritageClauses) {
        /** @type {Set<string>} */
        const interfaceNames = new Set();

        /** @param {ts.Type} type */
        const resolveInterfacesRecursive = (type) => {
          const symbol = type.getSymbol() || type.aliasSymbol;
          if (symbol) {
            interfaceNames.add(symbol.getName());
          }
          const baseTypes = type.getBaseTypes() || [];
          baseTypes.forEach((base) => resolveInterfacesRecursive(base));
        };

        for (const clause of node.heritageClauses) {
          if (clause.token === ts.SyntaxKind.ImplementsKeyword) {
            for (const typeNode of clause.types) {
              const type = checker.getTypeAtLocation(typeNode);
              resolveInterfacesRecursive(type);
            }
          }
        }

        if (interfaceNames.size > 0) {
          const staticProp = ts.factory.createPropertyDeclaration(
            [
              ts.factory.createModifier(ts.SyntaxKind.StaticKeyword),
              ts.factory.createModifier(ts.SyntaxKind.ReadonlyKeyword),
            ],
            "__implements__",
            undefined,
            undefined,
            ts.factory.createArrayLiteralExpression(
              Array.from(interfaceNames).map((name) =>
                ts.factory.createStringLiteral(name)
              )
            )
          );

          return ts.factory.updateClassDeclaration(
            node,
            node.modifiers,
            node.name,
            node.typeParameters,
            node.heritageClauses,
            [staticProp, ...node.members]
          );
        }
      }
      return ts.visitEachChild(node, visitor, context);
    };

    // The cast to SourceFile here resolves the type error
    return /** @type {ts.SourceFile} */ (ts.visitNode(sourceFile, visitor));
  };
}
