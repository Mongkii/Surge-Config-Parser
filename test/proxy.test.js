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
        server: '127.0.0.1',
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
        server: '127.0.0.1',
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

  parser.parse(config, {
    log: (log) =>
      expect(log).toBe('[ERROR in Proxy] Unsupported config: random-dca17ff9, value: 3'),
  });
});

test('generate proxy correctly', () => {
  const json = {
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
  };

  const result = `
[Proxy]
Test Proxy = ss, 127.0.0.1, 8080, encrypt-method = rc4-md5, password = abc123, udp-relay = true
`.trim();

  expect(parser.generate(json)).toBe(result);
});
