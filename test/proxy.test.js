const parser = require('../dist/index').default;

test('parse proxy correctly', () => {
  const config = `
[Proxy]
Test Proxy = ss, 127.0.0.1, 8080, encrypt-method=rc4-md5, password=abc123, udp-relay=true
`;

  expect(parser.parse(config)).toStrictEqual({
    Proxy: [
      {
        name: 'Test Proxy',
        type: 'ss',
        hostname: '127.0.0.1',
        port: 8080,
        'encrypt-method': 'rc4-md5',
        password: 'abc123',
        'udp-relay': true,
      },
    ],
  });
});

test('auto match username and password', () => {
  const config = `
[Proxy]
Test Proxy = ss, 127.0.0.1, 8080, test-name, abc123, encrypt-method=rc4-md5, udp-relay=true
`;

  expect(parser.parse(config)).toStrictEqual({
    Proxy: [
      {
        name: 'Test Proxy',
        type: 'ss',
        hostname: '127.0.0.1',
        port: 8080,
        username: 'test-name',
        password: 'abc123',
        'encrypt-method': 'rc4-md5',
        'udp-relay': true,
      },
    ],
  });
});

test('log unsupported config', () => {
  const config = `
[Proxy]
Test Proxy = ss, 127.0.0.1, 8080, random-dca17ff9 = 3
`;

  let log = ``;
  const setLog = (text) => (log = text);
  parser.parse(config, { log: setLog });

  expect(log).toBe('[ERROR in Proxy] Unsupported config: random-dca17ff9, value: 3');
});
