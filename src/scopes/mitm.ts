import { atomGenerators, fromEntries, isNonNil, ScopeGenerator } from '../utils';
import { MITM, MITMStrKeys } from '../types';
import { atomParsers, errUnsupport, ScopeParser, removeComment } from '../utils';

export const parse: ScopeParser<MITM> = (lines, writeToLog) => {
  const boolKeys = new Set([]);
  const numKeys = new Set([]);
  const arrKeys = new Set([]);
  const strKeys = new Set<MITMStrKeys>(['ca-p12', 'ca-passphrase']);

  const UNSUPPORTED_VALUE = Symbol();

  const getParsedValue = (key: string, value: string) => {
    if (boolKeys.has(key as never)) {
      return atomParsers.boolean(value);
    }
    if (numKeys.has(key as never)) {
      return atomParsers.number(value);
    }
    if (arrKeys.has(key as never)) {
      return atomParsers.comma(value);
    }
    if (strKeys.has(key as MITMStrKeys)) {
      return value;
    }
    return UNSUPPORTED_VALUE;
  };

  const keyValues = removeComment(lines).map(atomParsers.assign);

  const parsed: MITM = fromEntries(
    keyValues
      .map(([key, value]) => {
        const parsedValue = getParsedValue(key, value);

        if (parsedValue === UNSUPPORTED_VALUE) {
          writeToLog(errUnsupport('MITM', key, value));
          return null;
        }
        return [key, parsedValue];
      })
      .filter((keyValue): keyValue is [key: string, value: any] => Boolean(keyValue))
  );

  return parsed;
};

export const generate: ScopeGenerator<MITM> = (data, writeToLog) =>
  Object.entries(data)
    .filter(([key, value]) => isNonNil(value))
    .map((keyValue) => atomGenerators.assign(keyValue));
