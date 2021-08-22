const parser = require('../dist/index').default;

test('parse general correctly', () => {
  const config = `
[General]
loglevel = notify
# 从 Surge iOS 4 / Surge Mac 3.3.0 起，工具开始支持 DoH
doh-server = https://doh.pub/dns-query, https://dns.alidns.com/dns-query
# https://dns.alidns.com/dns-query, https://13800000000.rubyfish.cn/, https://doh.360.cn/dns-query, https://dns.google/dns-query
dns-server = system
tun-excluded-routes = 0.0.0.0/8, 10.0.0.0/8, 100.64.0.0/10, 127.0.0.0/8, 169.254.0.0/16, 172.16.0.0/12, 192.0.0.0/24, 192.0.2.0/24, 192.168.0.0/16, 192.88.99.0/24, 198.51.100.0/24, 203.0.113.0/24, 224.0.0.0/4, 255.255.255.255/32
skip-proxy = localhost, *.local, injections.adguard.org, local.adguard.org, captive.apple.com, guzzoni.apple.com, 0.0.0.0/8, 10.0.0.0/8, 17.0.0.0/8, 100.64.0.0/10, 127.0.0.0/8, 169.254.0.0/16, 172.16.0.0/12, 192.0.0.0/24, 192.0.2.0/24, 192.168.0.0/16, 192.88.99.0/24, 198.18.0.0/15, 198.51.100.0/24, 203.0.113.0/24, 224.0.0.0/4, 240.0.0.0/4, 255.255.255.255/32
wifi-assist = true
allow-wifi-access = true
wifi-access-http-port = 6152
wifi-access-socks5-port = 6153
http-listen = 0.0.0.0:6152
socks5-listen = 0.0.0.0:6153
external-controller-access = 请指定密码@0.0.0.0:6170
replica = false
tls-provider = openssl
network-framework = false
exclude-simple-hostnames = true
ipv6 = true
test-timeout = 4
proxy-test-url = http://www.gstatic.com/generate_204
geoip-maxmind-url = https://cdn.jsdelivr.net/gh/Hackl0us/GeoIP2-CN@release/Country.mmdb
`;

  expect(parser.parse(config)).toStrictEqual({
    General: {
      loglevel: 'notify',
      'doh-server': ['https://doh.pub/dns-query', 'https://dns.alidns.com/dns-query'],
      'dns-server': ['system'],
      'tun-excluded-routes': [
        '0.0.0.0/8',
        '10.0.0.0/8',
        '100.64.0.0/10',
        '127.0.0.0/8',
        '169.254.0.0/16',
        '172.16.0.0/12',
        '192.0.0.0/24',
        '192.0.2.0/24',
        '192.168.0.0/16',
        '192.88.99.0/24',
        '198.51.100.0/24',
        '203.0.113.0/24',
        '224.0.0.0/4',
        '255.255.255.255/32',
      ],
      'skip-proxy': [
        'localhost',
        '*.local',
        'injections.adguard.org',
        'local.adguard.org',
        'captive.apple.com',
        'guzzoni.apple.com',
        '0.0.0.0/8',
        '10.0.0.0/8',
        '17.0.0.0/8',
        '100.64.0.0/10',
        '127.0.0.0/8',
        '169.254.0.0/16',
        '172.16.0.0/12',
        '192.0.0.0/24',
        '192.0.2.0/24',
        '192.168.0.0/16',
        '192.88.99.0/24',
        '198.18.0.0/15',
        '198.51.100.0/24',
        '203.0.113.0/24',
        '224.0.0.0/4',
        '240.0.0.0/4',
        '255.255.255.255/32',
      ],
      'wifi-assist': true,
      'allow-wifi-access': true,
      'wifi-access-http-port': 6152,
      'wifi-access-socks5-port': 6153,
      'http-listen': '0.0.0.0:6152',
      'socks5-listen': '0.0.0.0:6153',
      'external-controller-access': '请指定密码@0.0.0.0:6170',
      replica: false,
      'tls-provider': 'openssl',
      'network-framework': false,
      'exclude-simple-hostnames': true,
      ipv6: true,
      'test-timeout': 4,
      'proxy-test-url': 'http://www.gstatic.com/generate_204',
      'geoip-maxmind-url': 'https://cdn.jsdelivr.net/gh/Hackl0us/GeoIP2-CN@release/Country.mmdb',
    },
  });
});

test('log unsupported config', () => {
  const config = `
[General]
random-e87279b4 = 4
  `;

  parser.parse(config, {
    log: (log) =>
      expect(log).toBe('[ERROR in General] Unsupported config: random-e87279b4, value: 4'),
  });
});

test('generate general correctly', () => {
  const json = {
    General: {
      loglevel: 'notify',
      'doh-server': ['https://doh.pub/dns-query', 'https://dns.alidns.com/dns-query'],
      'dns-server': ['system'],
      'tun-excluded-routes': [
        '0.0.0.0/8',
        '10.0.0.0/8',
        '100.64.0.0/10',
        '127.0.0.0/8',
        '169.254.0.0/16',
        '172.16.0.0/12',
        '192.0.0.0/24',
        '192.0.2.0/24',
        '192.168.0.0/16',
        '192.88.99.0/24',
        '198.51.100.0/24',
        '203.0.113.0/24',
        '224.0.0.0/4',
        '255.255.255.255/32',
      ],
      'skip-proxy': [
        'localhost',
        '*.local',
        'injections.adguard.org',
        'local.adguard.org',
        'captive.apple.com',
        'guzzoni.apple.com',
        '0.0.0.0/8',
        '10.0.0.0/8',
        '17.0.0.0/8',
        '100.64.0.0/10',
        '127.0.0.0/8',
        '169.254.0.0/16',
        '172.16.0.0/12',
        '192.0.0.0/24',
        '192.0.2.0/24',
        '192.168.0.0/16',
        '192.88.99.0/24',
        '198.18.0.0/15',
        '198.51.100.0/24',
        '203.0.113.0/24',
        '224.0.0.0/4',
        '240.0.0.0/4',
        '255.255.255.255/32',
      ],
      'wifi-assist': true,
      'allow-wifi-access': true,
      'wifi-access-http-port': 6152,
      'wifi-access-socks5-port': 6153,
      'http-listen': '0.0.0.0:6152',
      'socks5-listen': '0.0.0.0:6153',
      'external-controller-access': '请指定密码@0.0.0.0:6170',
      replica: false,
      'tls-provider': 'openssl',
      'network-framework': false,
      'exclude-simple-hostnames': true,
      ipv6: true,
      'test-timeout': 4,
      'proxy-test-url': 'http://www.gstatic.com/generate_204',
      'geoip-maxmind-url': 'https://cdn.jsdelivr.net/gh/Hackl0us/GeoIP2-CN@release/Country.mmdb',
    },
  };

  const result = `
[General]
loglevel = notify
doh-server = https://doh.pub/dns-query, https://dns.alidns.com/dns-query
dns-server = system
tun-excluded-routes = 0.0.0.0/8, 10.0.0.0/8, 100.64.0.0/10, 127.0.0.0/8, 169.254.0.0/16, 172.16.0.0/12, 192.0.0.0/24, 192.0.2.0/24, 192.168.0.0/16, 192.88.99.0/24, 198.51.100.0/24, 203.0.113.0/24, 224.0.0.0/4, 255.255.255.255/32
skip-proxy = localhost, *.local, injections.adguard.org, local.adguard.org, captive.apple.com, guzzoni.apple.com, 0.0.0.0/8, 10.0.0.0/8, 17.0.0.0/8, 100.64.0.0/10, 127.0.0.0/8, 169.254.0.0/16, 172.16.0.0/12, 192.0.0.0/24, 192.0.2.0/24, 192.168.0.0/16, 192.88.99.0/24, 198.18.0.0/15, 198.51.100.0/24, 203.0.113.0/24, 224.0.0.0/4, 240.0.0.0/4, 255.255.255.255/32
wifi-assist = true
allow-wifi-access = true
wifi-access-http-port = 6152
wifi-access-socks5-port = 6153
http-listen = 0.0.0.0:6152
socks5-listen = 0.0.0.0:6153
external-controller-access = 请指定密码@0.0.0.0:6170
replica = false
tls-provider = openssl
network-framework = false
exclude-simple-hostnames = true
ipv6 = true
test-timeout = 4
proxy-test-url = http://www.gstatic.com/generate_204
geoip-maxmind-url = https://cdn.jsdelivr.net/gh/Hackl0us/GeoIP2-CN@release/Country.mmdb
  `.trim();

  expect(parser.generate(json)).toBe(result);
});
