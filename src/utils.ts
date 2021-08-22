import type { ConfigJSON, WriteToLog } from './types';

export const fromEntries = <T = any>(entries: [string, T][]): { [k: string]: T } => {
  const result: { [k: string]: T } = {};

  entries.forEach(([key, value]) => {
    result[key] = value;
  });

  return result;
};

export type LinesParser<T> = (lines: string[], writeToLog: WriteToLog) => T;

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

export const testIsAssign = (text: string) => {
  const trimText = text.trim();

  const lastIndex = trimText.length - 1;
  const signIndex = trimText.indexOf('=');

  return signIndex !== -1 && signIndex !== lastIndex;
};
