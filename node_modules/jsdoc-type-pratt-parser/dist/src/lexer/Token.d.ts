export declare type TokenType = '(' | ')' | '[' | ']' | '{' | '}' | '|' | '&' | '<' | '>' | ',' | '*' | '?' | '!' | '=' | ':' | '.' | '@' | '#' | '~' | '/' | '=>' | '...' | 'null' | 'undefined' | 'function' | 'this' | 'new' | 'module' | 'event' | 'external' | 'typeof' | 'keyof' | 'import' | 'Identifier' | 'StringValue' | 'Number' | 'EOF';
export interface Token {
    type: TokenType;
    text: string;
}
