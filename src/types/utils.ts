/* eslint-disable @typescript-eslint/naming-convention */

/**
 * Take an interface and list the keys that are optional.
 *
 * @example
 * interface Hello {
 *   foo?: string;
 *   bar?: string;
 *   baz: string;
 * }
 *
 * OptionalKeys<Hello>;
 *
 * Will result in:
 * 'foo' | 'bar'
 */
export type OptionalKeys<T> = {
  [K in keyof T]: undefined extends T[K] ? K : never;
}[keyof T];

/**
 * Take an interface and choose what property should undefined.
 *
 * @example
 * interface Hello {
 *  foo: string;
 *  bar: string;
 *  baz?: string;
 * };
 *
 * Optional<Hello, 'bar'>;
 *
 * Will results in:
 * {
 *  foo: string;
 *  bar?: string;
 *  baz?: string;
 * }
 *
 */
export type Optional<T, K extends keyof T> = {
  [P in Exclude<keyof T, Exclude<keyof T, K | OptionalKeys<T>>>]?: T[P];
} & {
  [P in Exclude<keyof T, K | OptionalKeys<T>>]: T[P];
};

/**
 * Take an interface and replace specified property. (By default Typescript merge but do not replace).
 *
 * @example
 * interface Hello {
 *  foo: string;
 *  bar: string;
 * };
 *
 * Modify<Hello, { bar: number }>;
 *
 * Will results in:
 * {
 *  foo: string;
 *  bar: number;
 * }
 */
export type Modify<T, R> = Omit<T, keyof R> & R;

/**
 * Take an interface and choose what property should not be undefined.
 *
 * @example
 * interface Hello {
 *  foo?: string;
 *  bar?: string;
 * };
 *
 * RequireSome<Hello, 'bar'>;
 *
 * Will results in:
 * {
 *  foo?: string;
 *  bar: string;
 * }
 */
export type RequireSome<T, K extends string> = Omit<T, keyof K> & {
  [P in Exclude<keyof T, Exclude<keyof T, K>>]: Exclude<T[P], null | undefined>;
};

// stackoverflow.com/questions/49285864/is-there-a-valueof-similar-to-keyof-in-typescript
/**
 * Get values of type interface.
 *
 * @example
 * interface Foo { foo: string }
 * ValueOf<Foo>
 * => string.
 */
export type ValueOf<T> = T[keyof T];

/**
 * Get values of array.
 *
 * @example
 * const arr = [ 'foobar' ];
 * type ArrType = ValuesOfArray<typeof arr>;
 */
export type ValuesOfArray<T extends readonly any[]> = T[number];
