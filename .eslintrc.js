module.exports = {
  extends: ['algolia', 'algolia/typescript', 'algolia/jest'],
  rules: {
    'import/no-commonjs': 'off',
    'spaced-comment': 'off',

    // TMP
    'jsdoc/check-examples': ['off'],
  },
};
