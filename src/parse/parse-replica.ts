import { Replica, ReplicaBoolKeys } from '../types';
import { atomParsers, errUnsupport, LinesParser, removeComment } from './common';

const parseReplica: LinesParser<Replica> = (lines, writeToLog) => {
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

  const replicaData: Replica = Object.fromEntries(
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

  return replicaData;
};

export default parseReplica;
