import { fromEntries } from '../utils';
import { MITM, MITMStrKeys } from '../types';
import { atomParsers, errUnsupport, LinesParser, removeComment } from './common';

const parseMITM: LinesParser<MITM> = (lines, writeToLog) => {
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

  const mitmData: MITM = fromEntries(
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

  return mitmData;
};

export default parseMITM;
