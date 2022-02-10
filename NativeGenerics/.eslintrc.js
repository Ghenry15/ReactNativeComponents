module.exports = {
  root: true,
  extends: 'airbnb',
  parser: 'babel-eslint',
  plugins: [
    'react',
    'jsx-a11y',
    'import'
  ],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        '@typescript-eslint/no-shadow': ['error'],
        'no-shadow': 'off',
        'no-undef': 'off',
        'prettier/prettier': 0,
      },
    },
  ],
};
