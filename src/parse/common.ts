import type { ConfigJSON, WriteToLog } from '../types';

export type LinesParser<T> = (lines: string[], writeToLog: WriteToLog) => T;

export const errMsg = (scope: keyof ConfigJSON, text: string) => `[ERROR in ${scope}] ${text}`;

export const removeComment = (lines: string[]): string[] =>
  lines.filter(
    (line) => !line.startsWith('#') /* || line.startsWith('#!') Hashbang not supported for now */
  );

export const atomParsers = {
  boolean: (text: string): boolean => (text === 'true' ? true : false),
  number: (text: string): number => Number(text),
  comma: (text: string): string[] => text.split(',').map((piece) => piece.trim()),
  equal: (text: string): [left: string, right: string] => {
    let rawLeft = '';
    let rawRight = '';

    const textLen = text.length;
    for (let i = 0; i < textLen; i += 1) {
      const curLetter = text[i];
      if (curLetter !== '=') {
        rawLeft += curLetter;
        continue;
      }
      rawRight = text.slice(i + 1);
      break;
    }

    return [rawLeft.trim(), rawRight.trim()];
  },
};
