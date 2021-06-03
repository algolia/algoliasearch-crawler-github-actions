import { InfixParslet } from './Parslet'
import { TokenType } from '../lexer/Token'
import { Precedence } from '../Precedence'
import { Parser } from '../Parser'
import { JsdocObjectKeyValueResult, KeyValueResult } from '../result/NonTerminalResult'
import { assertTerminal } from '../assertTypes'
import { UnexpectedTypeError } from '../errors'
import { IntermediateResult } from '../result/IntermediateResult'

interface KeyValueParsletOptions {
  allowKeyTypes: boolean
  allowOptional: boolean
}

export class KeyValueParslet implements InfixParslet {
  private readonly allowKeyTypes: boolean
  private readonly allowOptional: boolean

  constructor (opts: KeyValueParsletOptions) {
    this.allowKeyTypes = opts.allowKeyTypes
    this.allowOptional = opts.allowOptional
  }

  accepts (type: TokenType, next: TokenType): boolean {
    return type === ':'
  }

  getPrecedence (): Precedence {
    return Precedence.KEY_VALUE
  }

  parseInfix (parser: Parser, left: IntermediateResult): KeyValueResult | JsdocObjectKeyValueResult {
    let optional = false

    if (this.allowOptional && left.type === 'JsdocTypeNullable') {
      optional = true
      left = left.element
    }

    if (left.type === 'JsdocTypeNumber' || left.type === 'JsdocTypeName' || left.type === 'JsdocTypeStringValue') {
      parser.consume(':')

      let quote
      if (left.type === 'JsdocTypeStringValue') {
        quote = left.meta.quote
      }

      return {
        type: 'JsdocTypeKeyValue',
        value: left.value.toString(),
        right: parser.parseType(Precedence.KEY_VALUE),
        optional: optional,
        meta: {
          quote
        }
      }
    } else {
      if (!this.allowKeyTypes) {
        throw new UnexpectedTypeError(left)
      }

      parser.consume(':')

      return {
        type: 'JsdocTypeKeyValue',
        left: assertTerminal(left),
        right: parser.parseType(Precedence.KEY_VALUE)
      }
    }
  }
}
