# CHANGES for `@es-joy/jsdoccomment`

## 0.8.0-alpha.2

- Fix: Avoid erring with missing `typeLines`

## 0.8.0-alpha.1

- Breaking change: Export globally as `JsdocComment`
- Breaking change: Change `JSDoc` prefixes of all node types to `Jsdoc`
- Breaking change: Drop `jsdoctypeparserToESTree`
- Breaking enhancement: Switch to `jsdoc-type-pratt-parser` (toward greater
    TypeScript expressivity and compatibility/support with catharsis)
- Enhancement: Export `jsdocTypeVisitorKeys` (from `jsdoc-type-pratt-parser`)

## 0.7.2

- Fix: Add `@description` to `noNames`

## 0.7.1

- Fix: Add `@summary` to `noNames`

## 0.7.0

- Enhancement: Allow specifying `noNames` and `noTypes` on `parseComment`
    to override (or add to) tags which should have no names or types.
- Enhancement: Export `hasSeeWithLink` utility and `defaultNoTypes` and
    `defaultNoNames`.

## 0.6.0

- Change `comment-parser` `tag` AST to avoid initial `@`

## 0.5.1

- Fix: Avoid setting `variation` name (just the description) (including in
    dist)
- npm: Add `prepublishOnly` script

## 0.5.0

- Fix: Avoid setting `variation` name (just the description)

## 0.4.4

- Fix: Avoid setting `name` and `description` for simple `@template SomeName`

## 0.4.3

- npm: Ignores Github file

## 0.4.2

- Fix: Ensure replacement of camel-casing (used in `jsdoctypeparser` nodes and
    visitor keys is global. The practical effect is that
    `JSDocTypeNamed_parameter` -> `JSDocTypeNamedParameter`,
    `JSDocTypeRecord_entry` -> `JSDocTypeRecordEntry`
    `JSDocTypeNot_nullable` -> `JSDocTypeNotNullable`
    `JSDocTypeInner_member` -> `JSDocTypeInnerMember`
    `JSDocTypeInstance_member` -> `JSDocTypeInstanceMember`
    `JSDocTypeString_value` -> `JSDocTypeStringValue`
    `JSDocTypeNumber_value` -> `JSDocTypeNumberValue`
    `JSDocTypeFile_path` -> `JSDocTypeFilePath`
    `JSDocTypeType_query` -> `JSDocTypeTypeQuery`
    `JSDocTypeKey_query` -> `JSDocTypeKeyQuery`
- Fix: Add missing `JSDocTypeLine` to visitor keys
- Docs: Explain AST structure/differences

## 0.4.1

- Docs: Indicate available methods with brief summary on README

## 0.4.0

- Enhancement: Expose `parseComment` and `getTokenizers`.

## 0.3.0

- Enhancement: Expose `toCamelCase` as new method rather than within a
    utility file.

## 0.2.0

- Enhancement: Exposes new methods: `commentHandler`,
    `commentParserToESTree`, `jsdocVisitorKeys`, `jsdoctypeparserToESTree`,
    `jsdocTypeVisitorKeys`,

## 0.1.1

- Build: Add Babel to work with earlier Node

## 0.1.0

- Initial version
