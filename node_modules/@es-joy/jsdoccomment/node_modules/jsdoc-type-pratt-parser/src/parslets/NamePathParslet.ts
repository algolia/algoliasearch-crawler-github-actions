import { InfixParslet } from './Parslet'
import { TokenType } from '../lexer/Token'
import { Precedence } from '../Precedence'
import { assertTerminal } from '../assertTypes'
import { UnexpectedTypeError } from '../errors'
import { StringValueParslet } from './StringValueParslet'
import { Parser } from '../Parser'
import { IntermediateResult } from '../result/IntermediateResult'
import { NamePathResult, NameResult, SpecialNamePath, TerminalResult } from '../result/TerminalResult'
import { NumberResult } from '..'

interface NamePathParsletOptions {
  allowJsdocNamePaths: boolean
}

export class NamePathParslet implements InfixParslet {
  private readonly allowJsdocNamePaths: boolean
  private readonly stringValueParslet: StringValueParslet

  constructor (opts: NamePathParsletOptions) {
    this.allowJsdocNamePaths = opts.allowJsdocNamePaths
    this.stringValueParslet = new StringValueParslet()
  }

  accepts (type: TokenType, next: TokenType): boolean {
    return (type === '.' && next !== '<') || (this.allowJsdocNamePaths && (type === '~' || type === '#'))
  }

  getPrecedence (): Precedence {
    return Precedence.NAME_PATH
  }

  parseInfix (parser: Parser, left: IntermediateResult): TerminalResult {
    let type: NamePathResult['pathType']

    if (parser.consume('.')) {
      type = 'property'
    } else if (parser.consume('~')) {
      type = 'inner'
    } else {
      parser.consume('#')
      type = 'instance'
    }

    let next

    if (parser.getToken().type === 'StringValue') {
      next = this.stringValueParslet.parsePrefix(parser)
    } else {
      next = parser.parseIntermediateType(Precedence.NAME_PATH)
      if (next.type !== 'JsdocTypeName' && next.type !== 'JsdocTypeNumber' && !(next.type === 'JsdocTypeSpecialNamePath' && next.specialType === 'event')) {
        throw new UnexpectedTypeError(next)
      }
    }

    return {
      type: 'JsdocTypeNamePath',
      left: assertTerminal(left),
      right: next as NameResult | NumberResult | SpecialNamePath<'event'>,
      pathType: type
    }
  }
}
