module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // add your custom rules here
  'rules': {
    'import/no-unresolved': 0,
    'no-alert': 0,
    'no-console': 0,
    'no-unused-expressions': 0,
    'no-cond-assign': 0,
    'no-param-reassign': 0,
    'no-restricted-syntax': 0,
    'guard-for-in': 0,
    'prefer-arrow-callback': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
