export type WriteToLog = (msg: string) => void;

export interface ParseOptions {
  /** Pass a function so it can deal with log outputs. */
  log?: (log: string) => void;
}

export interface GenerateOptions {
  /** Pass a function so it can deal with log outputs. */
  log?: (log: string) => void;
}

type AllNullable<T> = T extends Record<any, any>
  ? { [K in keyof T]?: AllNullable<T[K]> }
  : T | undefined;

export type GeneralBoolKeys =
  | 'wifi-assist'
  | 'allow-wifi-access'
  | 'replica'
  | 'network-framework'
  | 'exclude-simple-hostnames'
  | 'ipv6';
export type GeneralNumKeys = 'wifi-access-http-port' | 'wifi-access-socks5-port' | 'test-timeout';
export type GeneralArrKeys = 'doh-server' | 'dns-server' | 'tun-excluded-routes' | 'skip-proxy';
export type GeneralStrKeys =
  | 'loglevel'
  | 'http-listen'
  | 'socks5-listen'
  | 'external-controller-access'
  | 'tls-provider'
  | 'proxy-test-url'
  | 'geoip-maxmind-url';

export type General = AllNullable<
  { [K in GeneralBoolKeys]: boolean } &
    { [K in GeneralNumKeys]: number } &
    { [K in GeneralArrKeys]: string[] } &
    { [K in GeneralStrKeys]: string }
>;

export type ReplicaBoolKeys =
  | 'hide-apple-request'
  | 'hide-crashlytics-request'
  | 'use-keyword-filter'
  | 'hide-udp';
export type Replica = AllNullable<{ [K in ReplicaBoolKeys]: boolean }>;

export interface Host {
  [mapFrom: string]: string;
}

export type ProxyStrKeys =
  | 'username'
  | 'password'
  | 'encrypt-method'
  | 'psk'
  | 'obfs'
  | 'obfs-host';
export type ProxyBoolKeys = 'udp-relay' | 'tfo';

export type Proxy = {
  name: string;
  type: string;
  server: string;
  port: number;
} & AllNullable<{ [K in ProxyStrKeys]: string } & { [K in ProxyBoolKeys]: boolean }>;

export interface ProxyGroup {
  name: string;
  type: string;
  proxies: Proxy['name'][];
}

export interface NonFinalRule {
  __isFinal?: false;
  type: string;
  value: string;
  policy: string;
}
export interface FinalRule {
  __isFinal?: true;
  type: 'FINAL';
  value: null;
  policy: string;
}
export type Rule = NonFinalRule | FinalRule;

export interface UrlRewrite {
  from: string;
  to: string;
  mode?: string;
}

export type MITMStrKeys = 'ca-passphrase' | 'ca-p12';
export type MITM = AllNullable<{ [K in MITMStrKeys]: string }>;

export type ConfigJSON = AllNullable<{
  General: General;
  Host: Host;
  Replica: Replica;
  Proxy: Proxy[];
  'Proxy Group': ProxyGroup[];
  Rule: Rule[];
  'URL Rewrite': UrlRewrite[];
  MITM: MITM;
}>;

export type ScopeName = keyof ConfigJSON;
