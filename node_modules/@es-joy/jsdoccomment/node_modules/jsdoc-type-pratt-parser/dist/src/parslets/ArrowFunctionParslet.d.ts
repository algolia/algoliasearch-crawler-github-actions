import { InfixParslet, PrefixParslet } from './Parslet';
import { TokenType } from '../lexer/Token';
import { Precedence } from '../Precedence';
import { BaseFunctionParslet } from './BaseFunctionParslet';
import { Parser } from '../Parser';
import { FunctionResult } from '../result/TerminalResult';
import { IntermediateResult } from '../result/IntermediateResult';
export declare class ArrowFunctionWithoutParametersParslet implements PrefixParslet {
    accepts(type: TokenType, next: TokenType): boolean;
    getPrecedence(): Precedence;
    parsePrefix(parser: Parser): FunctionResult;
}
export declare class ArrowFunctionWithParametersParslet extends BaseFunctionParslet implements InfixParslet {
    accepts(type: TokenType, next: TokenType): boolean;
    getPrecedence(): Precedence;
    parseInfix(parser: Parser, left: IntermediateResult): FunctionResult;
}
