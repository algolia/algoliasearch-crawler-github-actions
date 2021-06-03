import { InfixParslet, PrefixParslet } from '../parslets/Parslet'

export type Grammar = () => ({
  prefixParslets: PrefixParslet[]
  infixParslets: InfixParslet[]
})
