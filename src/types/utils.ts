/* eslint-disable @typescript-eslint/naming-convention */
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
