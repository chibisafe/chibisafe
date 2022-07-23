module.exports = {
	root: true,
	extends: ['marine/prettier/node'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		requireConfigFile: false,
		parser: '@typescript-eslint/parser',
		sourceType: 'module'
	},
	env: {
		browser: true,
		es2017: true
	},
	rules: {
		'comma-dangle': ['error', 'never'],
		'import/order': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-unsafe-argument': 'off',
		'@typescript-eslint/prefer-ts-expect-error': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-unsafe-return': 'off',
		'@typescript-eslint/consistent-type-assertions': 'off'
	}
};
