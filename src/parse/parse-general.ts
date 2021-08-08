import { atomParsers, LinesParser, KeySet, removeComment } from './common';

const parseGeneral: LinesParser<any> = (lines) => {
  const keyValues = removeComment(lines).map(atomParsers.equal);

  const boolKeys: KeySet = new Set([
    'wifi-assist',
    'allow-wifi-access',
    'replica',
    'network-framework',
    'exclude-simple-hostnames',
    'ipv6',
  ]);
  const numKeys: KeySet = new Set([
    'wifi-access-http-port',
    'wifi-access-socks5-port',
    'test-timeout',
  ]);
  const arrKeys: KeySet = new Set([
    'doh-server',
    'dns-server',
    'tun-excluded-routes',
    'skip-proxy',
  ]);

  const generalData = Object.fromEntries(
    keyValues.map(([key, value]) => {
      if (boolKeys.has(key)) {
        return [key, atomParsers.boolean(value)];
      }
      if (numKeys.has(key)) {
        return [key, atomParsers.number(value)];
      }
      if (arrKeys.has(key)) {
        return [key, atomParsers.comma(value)];
      }
      return [key, value];
    })
  );

  return generalData;
};

export default parseGeneral;
