import { KeyValueResult, NonTerminalResult } from './NonTerminalResult';
import { TerminalResult } from './TerminalResult';
export interface ParameterList {
    type: 'JsdocTypeParameterList';
    elements: Array<KeyValueResult | TerminalResult>;
}
export declare type IntermediateResult = NonTerminalResult | ParameterList;
