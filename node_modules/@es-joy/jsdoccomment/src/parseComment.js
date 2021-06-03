// Todo: We ideally would use comment-parser's es6 directory, but as the repo
//   is CommonJS, it will not be properly treated as ESM from here
/* eslint-disable prefer-named-capture-group -- Temporary */
import {
  // eslint-disable-next-line import/no-named-default -- Both together
  default as descriptionTokenizer,
  getJoiner
} from 'comment-parser/lib/parser/tokenizers/description.js';
import {
  seedBlock,
  seedTokens
} from 'comment-parser/lib/util.js';
import {parse as commentParser} from 'comment-parser';
import nameTokenizer from 'comment-parser/lib/parser/tokenizers/name.js';
import tagTokenizer from 'comment-parser/lib/parser/tokenizers/tag.js';
import typeTokenizer from 'comment-parser/lib/parser/tokenizers/type.js';

export const hasSeeWithLink = (spec) => {
  return spec.tag === 'see' && (/\{@link.+?\}/u).test(spec.source[0].source);
};

export const defaultNoTypes = ['default', 'defaultvalue', 'see'];

export const defaultNoNames = [
  'access', 'author',
  'default', 'defaultvalue',
  'description',
  'example', 'exception',
  'license',
  'return', 'returns',
  'since', 'summary',
  'throws',
  'version', 'variation'
];

const getTokenizers = ({
  noTypes = defaultNoTypes,
  noNames = defaultNoNames
} = {}) => {
  // trim
  return [
    // Tag
    tagTokenizer(),

    // Type
    (spec) => {
      if (noTypes.includes(spec.tag)) {
        return spec;
      }

      return typeTokenizer()(spec);
    },

    // Name
    (spec) => {
      if (spec.tag === 'template') {
        // const preWS = spec.postTag;
        const remainder = spec.source[0].tokens.description;

        const pos = remainder.search(/(?<![\s,])\s/u);

        const name = pos === -1 ? remainder : remainder.slice(0, pos);
        const extra = remainder.slice(pos + 1);
        let postName = '', description = '';
        if (pos > -1) {
          [, postName, description] = extra.match(/(\s*)(.*)/u);
        }

        spec.name = name;
        spec.optional = false;
        const {tokens} = spec.source[0];
        tokens.name = name;
        tokens.postName = postName;
        tokens.description = description;

        return spec;
      }

      if (noNames.includes(spec.tag) || hasSeeWithLink(spec)) {
        return spec;
      }

      return nameTokenizer()(spec);
    },

    // Description
    (spec) => {
      return descriptionTokenizer(getJoiner('preserve'))(spec);
    }
  ];
};

/**
 *
 * @param {PlainObject} commentNode
 * @param {string} indent Whitespace
 * @returns {PlainObject}
 */
const parseComment = (commentNode, indent) => {
  // Preserve JSDoc block start/end indentation.
  return commentParser(`/*${commentNode.value}*/`, {
    // @see https://github.com/yavorskiy/comment-parser/issues/21
    tokenizers: getTokenizers()
  })[0] || seedBlock({
    source: [
      {
        number: 0,
        tokens: seedTokens({
          delimiter: '/**',
          description: '',
          end: '',
          postDelimiter: '',
          start: ''
        })
      },
      {
        number: 1,
        tokens: seedTokens({
          delimiter: '',
          description: '',
          end: '*/',
          postDelimiter: '',
          start: indent + ' '
        })
      }
    ]
  });
};

export {getTokenizers, parseComment};
