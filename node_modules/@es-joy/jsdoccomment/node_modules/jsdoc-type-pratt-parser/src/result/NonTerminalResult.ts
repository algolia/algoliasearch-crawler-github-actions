import { TerminalResult } from './TerminalResult'

/**
 * A parse sub result that might not be a valid type expression on its own.
 */
export type NonTerminalResult =
  TerminalResult
  | KeyValueResult
  | JsdocObjectKeyValueResult
  | NumberResult

/**
 * A key value pair represented by a `:`. Can occur as a named parameter of a {@link FunctionResult} or as an entry for
 * an {@link ObjectResult}. Is a {@link NonTerminalResult}. {@link JsdocObjectKeyValueResult} uses the same type name
 * and will not have a `value` property.
 */
export interface KeyValueResult {
  type: 'JsdocTypeKeyValue'
  value: string
  right: TerminalResult | undefined
  optional: boolean
  meta: {
    quote: 'single' | 'double' | undefined
  }
}

/**
 * A key value pair represented by a `:`. This particular variant of the `KEY_VALUE` type will only occur in `'jsdoc'`
 * parsing mode and can only occur in {@link ObjectResult}s. It can be differentiated from {@link KeyValueResult} by
 * the `left` property that will never appear on the latter.
 */
export interface JsdocObjectKeyValueResult {
  type: 'JsdocTypeKeyValue'
  left: TerminalResult
  right: TerminalResult
}

/**
 * A number. Can be the key of an {@link ObjectResult} entry or the parameter of a {@link SymbolResult}.
 * Is a {@link NonTerminalResult}.
 */
export interface NumberResult {
  type: 'JsdocTypeNumber'
  value: number
}
