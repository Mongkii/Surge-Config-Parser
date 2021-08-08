import { ProxyItem, ProxyItemBoolKeys, ProxyItemStrKeys } from '../types';
import { atomParsers, errUnsupport, LinesParser, removeComment, testIsAssign } from './common';

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

  const nameDetails = removeComment(lines).map(atomParsers.assign);

  const proxys: ProxyItem[] = nameDetails.map(([name, details]) => {
    const [type, server, port, mayUser, mayPassword, ...restDetailParts] =
      atomParsers.comma(details);

    const proxyItem: ProxyItem = {
      name,
      type: type || '',
      server: server || '',
      port: Number(port),
    };

    /** format may-not-assign value (like `'user123'`) to assign form (like `'username = user123'`) */
    const formatMayNotAssign = (assignName: string, mayNotAssignPart: string | undefined) =>
      mayNotAssignPart && !testIsAssign(mayNotAssignPart)
        ? `${assignName} = ${mayNotAssignPart}`
        : mayNotAssignPart;

    const assignDetailParts = [
      formatMayNotAssign('username', mayUser),
      formatMayNotAssign('password', mayPassword),
      ...restDetailParts,
    ].filter((valuePart): valuePart is string => typeof valuePart === 'string');

    assignDetailParts.forEach((detailPart) => {
      const [key, value] = atomParsers.assign(detailPart);

      const parsedValue = getParsedValue(key, value);

      if (parsedValue === UNSUPPORTED_VALUE) {
        writeToLog(errUnsupport('Proxy', key, value));
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
