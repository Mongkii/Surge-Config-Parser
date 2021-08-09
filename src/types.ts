export type WriteToLog = (msg: string) => void;

export interface ParseOptions {
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

export type ProxyStrKeys = 'username' | 'password' | 'encrypt-method';
export type ProxyBoolKeys = 'udp-relay';

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

export interface UrlRewrite {
  from: string;
  to: string;
  mode?: string;
}

export type MITMStrKeys = 'ca-passphrase' | 'ca-p12';
export type MITM = AllNullable<{ [K in MITMStrKeys]: string }>;

export type ConfigJSON = AllNullable<{
  General: General;
  Replica: Replica;
  Proxy: Proxy[];
  'Proxy Group': ProxyGroup[];
  'URL Rewrite': UrlRewrite[];
  MITM: MITM;
}>;
