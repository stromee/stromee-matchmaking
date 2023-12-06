module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:react-hooks/recommended',
		'plugin:@tanstack/eslint-plugin-query/recommended',
		'prettier',
	],
	ignorePatterns: ['dist', '.eslintrc.cjs', 'deployment'],
	parser: '@typescript-eslint/parser',
	plugins: ['react-refresh', 'import', '@tanstack/query'],
	rules: {
		'react-refresh/only-export-components': [
			'warn',
			{ allowConstantExport: true },
		],
		'import/no-default-export': 'error',
	},
};
