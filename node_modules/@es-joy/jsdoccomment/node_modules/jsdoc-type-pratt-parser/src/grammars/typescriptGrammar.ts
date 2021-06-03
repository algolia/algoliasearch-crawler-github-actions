import { TupleParslet } from '../parslets/TupleParslet'
import { Grammar } from './Grammar'
import { ArrayBracketsParslet } from '../parslets/ArrayBracketsParslet'
import { baseGrammar } from './baseGrammar'
import { TypeOfParslet } from '../parslets/TypeOfParslet'
import { KeyOfParslet } from '../parslets/KeyOfParslet'
import { ImportParslet } from '../parslets/ImportParslet'
import { StringValueParslet } from '../parslets/StringValueParslet'
import { FunctionParslet } from '../parslets/FunctionParslet'
import {
  ArrowFunctionWithoutParametersParslet,
  ArrowFunctionWithParametersParslet
} from '../parslets/ArrowFunctionParslet'
import { NamePathParslet } from '../parslets/NamePathParslet'
import { KeyValueParslet } from '../parslets/KeyValueParslet'
import { VariadicParslet } from '../parslets/VariadicParslet'
import { NameParslet } from '../parslets/NameParslet'
import { IntersectionParslet } from '../parslets/IntersectionParslet'
import { ObjectParslet } from '../parslets/ObjectParslet'

export const typescriptGrammar: Grammar = () => {
  const {
    prefixParslets,
    infixParslets
  } = baseGrammar()

  // typescript does not support explicit non nullability
  // https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#patterns-that-are-known-not-to-be-supported

  // module seems not to be supported

  return {
    prefixParslets: [
      ...prefixParslets,
      new ObjectParslet({
        allowKeyTypes: false
      }),
      new TypeOfParslet(),
      new KeyOfParslet(),
      new ImportParslet(),
      new StringValueParslet(),
      new ArrowFunctionWithoutParametersParslet(),
      new FunctionParslet({
        allowWithoutParenthesis: false,
        allowNoReturnType: false,
        allowNamedParameters: ['this', 'new']
      }),
      new TupleParslet({
        allowQuestionMark: false
      }),
      new VariadicParslet({
        allowEnclosingBrackets: false
      }),
      new NameParslet({
        allowedAdditionalTokens: ['module', 'event', 'external']
      })
    ],
    infixParslets: [
      ...infixParslets,
      new ArrayBracketsParslet(),
      new ArrowFunctionWithParametersParslet(),
      new NamePathParslet({
        allowJsdocNamePaths: false
      }),
      new KeyValueParslet({
        allowKeyTypes: false,
        allowOptional: true
      }),
      new IntersectionParslet()
    ]
  }
}
