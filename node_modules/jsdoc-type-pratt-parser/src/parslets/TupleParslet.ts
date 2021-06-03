import { assertTerminal } from '../assertTypes'
import { TokenType } from '../lexer/Token'
import { Parser } from '../Parser'
import { PrefixParslet } from './Parslet'
import { Precedence } from '../Precedence'
import { TupleResult } from '../result/TerminalResult'

interface TupleParsletOptions {
  allowQuestionMark: boolean
}

export class TupleParslet implements PrefixParslet {
  private readonly allowQuestionMark: boolean

  constructor (opts: TupleParsletOptions) {
    this.allowQuestionMark = opts.allowQuestionMark
  }

  accepts (type: TokenType, next: TokenType): boolean {
    return type === '['
  }

  getPrecedence (): Precedence {
    return Precedence.TUPLE
  }

  parsePrefix (parser: Parser): TupleResult {
    parser.consume('[')
    const result: TupleResult = {
      type: 'JsdocTypeTuple',
      elements: []
    }

    if (parser.consume(']')) {
      return result
    }

    const typeList = parser.parseIntermediateType(Precedence.ALL)
    if (typeList.type === 'JsdocTypeParameterList') {
      result.elements = typeList.elements.map(assertTerminal)
    } else {
      result.elements = [assertTerminal(typeList)]
    }

    if (!parser.consume(']')) {
      throw new Error('Unterminated \'[\'')
    }

    if (!this.allowQuestionMark && result.elements.some(e => e.type === 'JsdocTypeUnknown')) {
      throw new Error('Question mark in tuple not allowed')
    }

    return result
  }
}
