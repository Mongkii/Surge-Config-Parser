import { fromEntries } from '../utils';
import { General, GeneralArrKeys, GeneralBoolKeys, GeneralNumKeys, GeneralStrKeys } from '../types';
import { atomParsers, errUnsupport, LinesParser, removeComment } from '../utils';

export const parse: LinesParser<General> = (lines, writeToLog) => {
  const boolKeys = new Set<GeneralBoolKeys>([
    'wifi-assist',
    'allow-wifi-access',
    'replica',
    'network-framework',
    'exclude-simple-hostnames',
    'ipv6',
  ]);
  const numKeys = new Set<GeneralNumKeys>([
    'wifi-access-http-port',
    'wifi-access-socks5-port',
    'test-timeout',
  ]);
  const arrKeys = new Set<GeneralArrKeys>([
    'doh-server',
    'dns-server',
    'tun-excluded-routes',
    'skip-proxy',
  ]);
  const strKeys = new Set<GeneralStrKeys>([
    'loglevel',
    'http-listen',
    'socks5-listen',
    'external-controller-access',
    'tls-provider',
    'proxy-test-url',
    'geoip-maxmind-url',
  ]);

  const UNSUPPORTED_VALUE = Symbol();

  const getParsedValue = (key: string, value: string) => {
    if (boolKeys.has(key as GeneralBoolKeys)) {
      return atomParsers.boolean(value);
    }
    if (numKeys.has(key as GeneralNumKeys)) {
      return atomParsers.number(value);
    }
    if (arrKeys.has(key as GeneralArrKeys)) {
      return atomParsers.comma(value);
    }
    if (strKeys.has(key as GeneralStrKeys)) {
      return value;
    }
    return UNSUPPORTED_VALUE;
  };

  const keyValues = removeComment(lines).map(atomParsers.assign);

  const generalData: General = fromEntries(
    keyValues
      .map(([key, value]) => {
        const parsedValue = getParsedValue(key, value);

        if (parsedValue === UNSUPPORTED_VALUE) {
          writeToLog(errUnsupport('General', key, value));
          return null;
        }
        return [key, parsedValue];
      })
      .filter((keyValue): keyValue is [key: string, value: any] => Boolean(keyValue))
  );

  return generalData;
};
