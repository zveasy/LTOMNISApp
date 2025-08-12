module.exports = {
  preset: 'react-native',
  testMatch: ['**/__tests__/**/*.(test|spec).(js|jsx|ts|tsx)'],
  moduleNameMapper: {
    "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js"
  },
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  setupFilesAfterEnv: ['<rootDir>/jestSetup.js'],
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|@rneui|react-native-elements|react-native-size-matters|react-native-ratings|react-native-vector-icons|@invertase|intl-pluralrules)/)'
  ],
};
