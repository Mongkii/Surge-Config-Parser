const parser = require('../dist/index').default;

test('parse replica correctly', () => {
  const config = `
[MITM]
ca-passphrase = 1234ABCD
ca-p12 = MIIKPAIBAz/=
`;

  expect(parser.parse(config)).toStrictEqual({
    MITM: {
      'ca-passphrase': '1234ABCD',
      'ca-p12': 'MIIKPAIBAz/=',
    },
  });
});

test('log unsupported config', () => {
  const config = `
[MITM]
random-1234f820 = 2
  `;

  parser.parse(config, {
    log: (log) => expect(log).toBe('[ERROR in MITM] Unsupported config: random-1234f820, value: 2'),
  });
});

test('generate replica correctly', () => {
  const json = {
    MITM: {
      'ca-passphrase': '1234ABCD',
      'ca-p12': 'MIIKPAIBAz/=',
    },
  };

  const result = `
[MITM]
ca-passphrase = 1234ABCD
ca-p12 = MIIKPAIBAz/=
`.trim();

  expect(parser.generate(json)).toBe(result);
});
