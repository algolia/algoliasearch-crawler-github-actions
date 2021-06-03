import { TupleParslet } from '../parslets/TupleParslet'
import { GrammarFactory } from './Grammar'
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
import { moduleGrammar } from './moduleGrammar'
import { SpecialNamePathParslet } from '../parslets/SpecialNamePathParslet'

export const typescriptGrammar: GrammarFactory = () => {
  const {
    prefixParslets,
    infixParslets
  } = baseGrammar()

  // module seems not to be supported

  return {
    parallel: [
      moduleGrammar()
    ],
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
        allowWithoutParenthesis: true,
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
        allowedAdditionalTokens: ['event', 'external']
      }),
      new SpecialNamePathParslet({
        allowedTypes: ['module']
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
