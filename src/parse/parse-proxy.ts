import { ProxyItem, ProxyItemBoolKeys, ProxyItemStrKeys } from '../types';
import { atomParsers, errMsg, LinesParser, removeComment, testIsEqual } from './common';

const parseProxy: LinesParser<ProxyItem[]> = (lines, writeToLog) => {
  const boolKeys = new Set<ProxyItemBoolKeys>(['udp-relay']);
  const numKeys = new Set([]);
  const arrKeys = new Set([]);
  const strKeys = new Set<ProxyItemStrKeys>(['username', 'password', 'encrypt-method']);

  const UNSUPPORTED_VALUE = Symbol();

  const getParsedValue = (key: string, value: string) => {
    if (boolKeys.has(key as ProxyItemBoolKeys)) {
      return atomParsers.boolean(value);
    }
    if (numKeys.has(key as never)) {
      return atomParsers.number(value);
    }
    if (arrKeys.has(key as never)) {
      return atomParsers.comma(value);
    }
    if (strKeys.has(key as ProxyItemStrKeys)) {
      return value;
    }
    return UNSUPPORTED_VALUE;
  };

  const nameDetails = removeComment(lines).map(atomParsers.equal);

  const proxys: ProxyItem[] = nameDetails.map(([name, details]) => {
    const [type, hostname, port, mayUser, mayPassword, ...restDetailParts] =
      atomParsers.comma(details);
    const proxyItem: ProxyItem = {
      name,
      type: type || '',
      hostname: hostname || '',
      port: Number(port),
    };

    const formatMayEqual = (equalName: string, mayEqualPart: string | undefined) =>
      mayEqualPart && !testIsEqual(mayEqualPart) ? `${equalName} = ${mayEqualPart}` : mayEqualPart;

    const equalDetailParts = [
      formatMayEqual('username', mayUser),
      formatMayEqual('password', mayPassword),
      ...restDetailParts,
    ].filter((valuePart): valuePart is string => typeof valuePart === 'string');

    equalDetailParts.forEach((detailPart) => {
      const [key, value] = atomParsers.equal(detailPart);

      const parsedValue = getParsedValue(key, value);

      if (parsedValue === UNSUPPORTED_VALUE) {
        writeToLog(errMsg('Proxy', `Unsupported config: ${key}, value: ${value}`));
        return;
      }
      // @ts-ignore TS can't validate such situation,
      proxyItem[key] = parsedValue;
    });

    return proxyItem;
  });

  return proxys;
};

export default parseProxy;
