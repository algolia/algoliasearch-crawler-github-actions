import { KeyValueResult } from './result/NonTerminalResult';
import { NameResult, NumberResult, TerminalResult, VariadicResult } from './result/TerminalResult';
import { IntermediateResult } from './result/IntermediateResult';
export declare function assertTerminal(result?: IntermediateResult): TerminalResult;
export declare function assertKeyValueOrTerminal(result: IntermediateResult): KeyValueResult | TerminalResult;
export declare function assertKeyValueOrName(result: IntermediateResult): KeyValueResult | NameResult;
export declare function assertNumberOrVariadicName(result: IntermediateResult): NumberResult | NameResult | VariadicResult<NameResult>;
