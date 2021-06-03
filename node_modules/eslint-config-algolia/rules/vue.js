// eslint-disable-next-line import/no-commonjs
module.exports = {
  rules: {
    'no-trailing-spaces': ['error'], // Prettier disable it but Prettier doesn't work on <template>
    'vue/html-closing-bracket-newline': [
      'error',
      {
        multiline: 'always',
      },
    ],
    'vue/html-closing-bracket-spacing': ['error'],
  },
};
