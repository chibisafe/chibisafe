module.exports = {
	moduleFileExtensions: ['js', 'json', 'vue'],
	moduleDirectories: ['node_modules'],
	transform: {
		'^.+\\.js$': '<rootDir>/node_modules/babel-jest',
		'.*\\.(vue)$': '<rootDir>/node_modules/vue-jest'
	},
	transformIgnorePatterns: ['/node_modules/(?!vue)']
};
