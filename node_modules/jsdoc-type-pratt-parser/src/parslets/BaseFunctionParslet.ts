import { KeyValueResult, NonTerminalResult } from '../result/NonTerminalResult'
import { assertKeyValueOrTerminal } from '../assertTypes'
import { UnexpectedTypeError } from '../errors'
import { IntermediateResult } from '../result/IntermediateResult'
import { TerminalResult } from '../result/TerminalResult'

export class BaseFunctionParslet {
  protected getParameters (value: IntermediateResult): Array<TerminalResult | KeyValueResult> {
    let parameters: NonTerminalResult[]
    if (value.type === 'JsdocTypeParameterList') {
      parameters = value.elements
    } else if (value.type === 'JsdocTypeParenthesis') {
      parameters = [value.element]
    } else {
      throw new UnexpectedTypeError(value)
    }

    return parameters.map(p => assertKeyValueOrTerminal(p))
  }

  protected getNamedParameters (value: IntermediateResult): KeyValueResult[] {
    const parameters = this.getParameters(value)
    if (parameters.some(p => p.type !== 'JsdocTypeKeyValue')) {
      throw new Error('All parameters should be named')
    }
    return parameters as KeyValueResult[]
  }

  protected getUnnamedParameters (value: IntermediateResult): TerminalResult[] {
    const parameters = this.getParameters(value)
    if (parameters.some(p => p.type === 'JsdocTypeKeyValue')) {
      throw new Error('No parameter should be named')
    }
    return parameters as TerminalResult[]
  }
}
