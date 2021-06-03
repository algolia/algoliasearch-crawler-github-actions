import { KeyValueResult } from './result/NonTerminalResult'
import { UnexpectedTypeError } from './errors'
import { NameResult, NumberResult, TerminalResult, VariadicResult } from './result/TerminalResult'
import { IntermediateResult } from './result/IntermediateResult'

export function assertTerminal (result?: IntermediateResult): TerminalResult {
  if (result === undefined) {
    throw new Error('Unexpected undefined')
  }
  if (result.type === 'JsdocTypeKeyValue' || result.type === 'JsdocTypeParameterList' || result.type === 'JsdocTypeProperty') {
    throw new UnexpectedTypeError(result)
  }
  return result
}

export function assertKeyValueOrTerminal (result: IntermediateResult): KeyValueResult | TerminalResult {
  if (result.type === 'JsdocTypeKeyValue' && 'value' in result) {
    return result
  }
  return assertTerminal(result)
}

export function assertKeyValueOrName (result: IntermediateResult): KeyValueResult | NameResult {
  if (result.type === 'JsdocTypeKeyValue' && 'value' in result) {
    return result
  } else if (result.type !== 'JsdocTypeName') {
    throw new UnexpectedTypeError(result)
  }
  return result
}

export function assertNumberOrVariadicName (result: IntermediateResult): NumberResult | NameResult | VariadicResult<NameResult> {
  if (result.type === 'JsdocTypeVariadic') {
    if (result.element?.type === 'JsdocTypeName') {
      return result as VariadicResult<NameResult>
    }
    throw new UnexpectedTypeError(result)
  }
  if (result.type !== 'JsdocTypeNumber' && result.type !== 'JsdocTypeName') {
    throw new UnexpectedTypeError(result)
  }
  return result
}
