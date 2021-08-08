import { ProxyGroup } from '../types';
import { atomParsers, LinesParser, removeComment } from './common';

const parseProxyGroup: LinesParser<ProxyGroup[]> = (lines, writeToLog) => {
  // const boolKeys = new Set([]);
  // const numKeys = new Set([]);
  // const arrKeys = new Set([]);
  // const strKeys = new Set([]);

  // const UNSUPPORTED_VALUE = Symbol();

  // const getParsedValue = (key: string, value: string) => {
  //   if (boolKeys.has(key as ProxyBoolKeys)) {
  //     return atomParsers.boolean(value);
  //   }
  //   if (numKeys.has(key as never)) {
  //     return atomParsers.number(value);
  //   }
  //   if (arrKeys.has(key as never)) {
  //     return atomParsers.comma(value);
  //   }
  //   if (strKeys.has(key as ProxyStrKeys)) {
  //     return value;
  //   }
  //   return UNSUPPORTED_VALUE;
  // };

  const nameDetails = removeComment(lines).map(atomParsers.assign);

  const proxyGroups: ProxyGroup[] = nameDetails.map(([name, details]) => {
    const [type, ...proxies] = atomParsers.comma(details);

    const proxyGroup: ProxyGroup = {
      name,
      type: type || '',
      proxies,
    };

    return proxyGroup;
  });

  return proxyGroups;
};

export default parseProxyGroup;
