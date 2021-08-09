const parser = require('../dist/index').default;

test('parse combined config correctly', () => {
  const config = `
[General]
loglevel = notify
dns-server = system

[Proxy]
Test Proxy = ss, 127.0.0.1, 8080, encrypt-method=rc4-md5, password=abc123, udp-relay=true

[Proxy Group]
Test Group = select, 1 2 3, ab c, 3)_#*)@$()

[Rule]
DOMAIN,test.com,DIRECT

[MITM]
ca-passphrase = 1234ABCD
ca-p12 = MIIKPAIBAz/=
`;

  expect(parser.parse(config)).toStrictEqual({
    General: {
      loglevel: 'notify',
      'dns-server': ['system'],
    },
    Proxy: [
      {
        name: 'Test Proxy',
        type: 'ss',
        server: '127.0.0.1',
        port: 8080,
        'encrypt-method': 'rc4-md5',
        password: 'abc123',
        'udp-relay': true,
      },
    ],
    'Proxy Group': [
      {
        name: 'Test Group',
        type: 'select',
        proxies: ['1 2 3', 'ab c', '3)_#*)@$()'],
      },
    ],
    Rule: [{ type: 'DOMAIN', value: 'test.com', policy: 'DIRECT' }],
    MITM: {
      'ca-passphrase': '1234ABCD',
      'ca-p12': 'MIIKPAIBAz/=',
    },
  });
});

test('log unsupported config', () => {
  const config = `
[General]
random-c7c6672a = 1

[Proxy]
Test Proxy = ss, 127.0.0.1, 8080, random-1854a098=2

[Rule]
,,

[MITM]
random-bdaaf25a = 3
  `;

  parser.parse(config, {
    log: (log) =>
      expect(log).toBe(
        `
[ERROR in General] Unsupported config: random-c7c6672a, value: 1
[ERROR in Proxy] Unsupported config: random-1854a098, value: 2
[ERROR in Rule] Unsupported rule: ",,"
[ERROR in MITM] Unsupported config: random-bdaaf25a, value: 3
`.trim()
      ),
  });
});
