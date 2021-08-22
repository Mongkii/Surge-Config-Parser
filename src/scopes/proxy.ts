import { Proxy, ProxyBoolKeys, ProxyStrKeys } from '../types';
import {
  atomGenerators,
  atomParsers,
  errUnsupport,
  ScopeGenerator,
  ScopeParser,
  removeComment,
  testIsAssign,
} from '../utils';

export const parse: ScopeParser<Proxy[]> = (lines, writeToLog) => {
  const boolKeys = new Set<ProxyBoolKeys>(['udp-relay', 'tfo']);
  const numKeys = new Set([]);
  const arrKeys = new Set([]);
  const strKeys = new Set<ProxyStrKeys>([
    'username',
    'password',
    'encrypt-method',
    'psk',
    'obfs',
    'obfs-host',
  ]);

  const UNSUPPORTED_VALUE = Symbol();

  const getParsedValue = (key: string, value: string) => {
    if (boolKeys.has(key as ProxyBoolKeys)) {
      return atomParsers.boolean(value);
    }
    if (numKeys.has(key as never)) {
      return atomParsers.number(value);
    }
    if (arrKeys.has(key as never)) {
      return atomParsers.comma(value);
    }
    if (strKeys.has(key as ProxyStrKeys)) {
      return value;
    }
    return UNSUPPORTED_VALUE;
  };

  const nameDetails = removeComment(lines).map(atomParsers.assign);

  const parsed: Proxy[] = nameDetails.map(([name, details]) => {
    const [type, server, port, mayUser, mayPassword, ...restDetailParts] =
      atomParsers.comma(details);

    const proxy: Proxy = {
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

    /** proxy detailed parts, all in 'assign format' (key = value). */
    const detailParts = [
      formatMayNotAssign('username', mayUser),
      formatMayNotAssign('password', mayPassword),
      ...restDetailParts,
    ].filter((valuePart): valuePart is string => typeof valuePart === 'string');

    detailParts.forEach((detailPart) => {
      const [key, value] = atomParsers.assign(detailPart);

      const parsedValue = getParsedValue(key, value);

      if (parsedValue === UNSUPPORTED_VALUE) {
        writeToLog(errUnsupport('Proxy', key, value));
        return;
      }
      // @ts-ignore TS can't validate such situation.
      proxy[key] = parsedValue;
    });

    return proxy;
  });

  return parsed;
};

export const generate: ScopeGenerator<Proxy[]> = (data, writeToLog) =>
  data
    .filter((proxy) => Boolean(proxy.name /* && proxy.type // allow empty type for now. */))
    .map((proxy) => {
      const { name, type, server, port, ...detailParts } = proxy;
      const detailPartsInAssignForm = Object.entries(detailParts).map((keyValue) =>
        atomGenerators.assign(keyValue, atomGenerators.comma)
      );
      return atomGenerators.assign([name, [type, server, port, ...detailPartsInAssignForm]]);
    });
