import type { ConfigJSON, WriteToLog } from './types';

export const isNonNil = <T>(input: T): input is NonNullable<T> => input != null;

export const fromEntries = <T = any>(entries: [string, T][]): { [k: string]: T } => {
  const result: { [k: string]: T } = {};

  entries.forEach(([key, value]) => {
    result[key] = value;
  });

  return result;
};

export type ScopeParser<T> = (lines: string[], writeToLog: WriteToLog) => T;

export type ScopeGenerator<T> = (data: T, writeToLog: WriteToLog) => string[];

export const errMsg = (scope: keyof ConfigJSON, text: string) => `[ERROR in ${scope}] ${text}`;

export const errUnsupport = (scope: keyof ConfigJSON, key: string, value: string) =>
  errMsg(scope, `Unsupported config: ${key}, value: ${value}`);

export const removeComment = (lines: string[]): string[] =>
  lines.filter(
    (line) => !line.startsWith('#') /* || line.startsWith('#!') Hashbang not supported for now */
  );

export const atomParsers = {
  boolean: (text: string): boolean => (text === 'true' ? true : false),
  number: (text: string): number => Number(text),
  comma: (text: string): string[] => text.split(',').map((piece) => piece.trim()),
  space: (text: string): string[] => text.split(/\s+/).filter(Boolean),
  assign: (text: string): [left: string, right: string] => {
    const signIndex = text.indexOf('=');

    return signIndex === -1
      ? ['', '']
      : [text.slice(0, signIndex).trim(), text.slice(signIndex + 1).trim()];
  },
};

const commaGenerator = (items: any[]): string => items.filter(isNonNil).join(', ');

export const atomGenerators = {
  comma: commaGenerator,
  space: (items: any[]): string => items.filter(isNonNil).join(' '),
  /**
   * generate 'key = value' from keyValue pair. You should specify how to deal with array value.
   * @param keyValue
   * @param formatArr How to generate string from array value. If not specified, `atomGenerators.comma` will be used.
   * @returns
   */
  assign: (
    [left, right]: [left: string, right: any],
    formatArr: (items: any[]) => string = commaGenerator
  ): string => {
    const strRight = Array.isArray(right) ? formatArr(right) : String(right);
    return `${left} = ${strRight}`;
  },
};

export const testIsAssign = (text: string) => {
  const trimText = text.trim();

  const lastIndex = trimText.length - 1;
  const signIndex = trimText.indexOf('=');

  return signIndex !== -1 && signIndex !== lastIndex;
};
