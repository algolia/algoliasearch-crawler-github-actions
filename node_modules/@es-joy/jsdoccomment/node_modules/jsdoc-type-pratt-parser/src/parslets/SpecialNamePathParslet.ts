import { PrefixParslet } from './Parslet'
import { TokenType } from '../lexer/Token'
import { Precedence } from '../Precedence'
import { Parser } from '../Parser'
import { NameResult, SpecialNamePath } from '../result/TerminalResult'

export class SpecialNamePathParslet implements PrefixParslet {
  accepts (type: TokenType, next: TokenType): boolean {
    return type === 'module' || type === 'event' || type === 'external'
  }

  getPrecedence (): Precedence {
    return Precedence.PREFIX
  }

  parsePrefix (parser: Parser): SpecialNamePath | NameResult {
    const type = parser.getToken().text as 'module' | 'event' | 'external'
    parser.consume('module') || parser.consume('event') || parser.consume('external')
    if (!parser.consume(':')) {
      return {
        type: 'JsdocTypeName',
        value: type
      }
    }
    let token = parser.getToken()
    if (parser.consume('StringValue')) {
      return {
        type: 'JsdocTypeSpecialNamePath',
        value: token.text.slice(1, -1),
        specialType: type,
        meta: {
          quote: token.text[0] === '\'' ? 'single' : 'double'
        }
      }
    } else {
      let result = ''
      const allowed: TokenType[] = ['Identifier', '@', '/']
      while (allowed.some(type => parser.consume(type))) {
        result += token.text
        token = parser.getToken()
      }
      return {
        type: 'JsdocTypeSpecialNamePath',
        value: result,
        specialType: type,
        meta: {
          quote: undefined
        }
      }
    }
  }
}
