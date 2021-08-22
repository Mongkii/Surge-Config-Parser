import { atomGenerators, fromEntries, isNonNil, ScopeGenerator } from '../utils';
import { Replica, ReplicaBoolKeys } from '../types';
import { atomParsers, errUnsupport, ScopeParser, removeComment } from '../utils';

export const parse: ScopeParser<Replica> = (lines, writeToLog) => {
  const boolKeys = new Set<ReplicaBoolKeys>([
    'hide-apple-request',
    'hide-crashlytics-request',
    'hide-udp',
    'use-keyword-filter',
  ]);
  const numKeys = new Set([]);
  const arrKeys = new Set([]);
  const strKeys = new Set([]);

  const UNSUPPORTED_VALUE = Symbol();

  const getParsedValue = (key: string, value: string) => {
    if (boolKeys.has(key as ReplicaBoolKeys)) {
      return atomParsers.boolean(value);
    }
    if (numKeys.has(key as never)) {
      return atomParsers.number(value);
    }
    if (arrKeys.has(key as never)) {
      return atomParsers.comma(value);
    }
    if (strKeys.has(key as never)) {
      return value;
    }
    return UNSUPPORTED_VALUE;
  };

  const keyValues = removeComment(lines).map(atomParsers.assign);

  const parsed: Replica = fromEntries(
    keyValues
      .map(([key, value]) => {
        const parsedValue = getParsedValue(key, value);

        if (parsedValue === UNSUPPORTED_VALUE) {
          writeToLog(errUnsupport('Replica', key, value));
          return null;
        }
        return [key, parsedValue];
      })
      .filter((keyValue): keyValue is [key: string, value: any] => Boolean(keyValue))
  );

  return parsed;
};

export const generate: ScopeGenerator<Replica> = (data, writeToLog) =>
  Object.entries(data)
    .filter(([key, value]) => isNonNil(value))
    .map((keyValue) => atomGenerators.assign(keyValue));
