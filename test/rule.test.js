const parser = require('../dist/index').default;

test('parse rule correctly', () => {
  const config = `
[Rule]
DOMAIN,test.com,DIRECT
# RULE-SET,https://test.co/foo/bar/baz.list,Proxy
RULE-SET,https://test.co/foo/bar.list,REJECT-TINYGIF
AND,((SRC-IP,192.168.1.110), (DOMAIN, example.com)),DIRECT
GEOIP,TEST,Proxy
FINAL,Proxy
`;

  expect(parser.parse(config)).toStrictEqual({
    Rule: [
      { type: 'DOMAIN', value: 'test.com', policy: 'DIRECT' },
      { type: 'RULE-SET', value: 'https://test.co/foo/bar.list', policy: 'REJECT-TINYGIF' },
      { type: 'AND', value: '((SRC-IP,192.168.1.110), (DOMAIN, example.com))', policy: 'DIRECT' },
      { type: 'GEOIP', value: 'TEST', policy: 'Proxy' },
      { __isFinal: true, type: 'FINAL', value: null, policy: 'Proxy' },
    ],
  });
});

test('warn on unsupported rule', () => {
  const config = `
[Rule]
,,,
`;

  parser.parse(config, {
    log: (log) => expect(log).toBe('[ERROR in Rule] Unsupported rule: ",,,"'),
  });
});

test('generate rule correctly', () => {
  const json = {
    Rule: [
      { type: 'DOMAIN', value: 'test.com', policy: 'DIRECT' },
      { type: 'RULE-SET', value: 'https://test.co/foo/bar.list', policy: 'REJECT-TINYGIF' },
      { type: 'AND', value: '((SRC-IP,192.168.1.110), (DOMAIN, example.com))', policy: 'DIRECT' },
      { type: 'GEOIP', value: 'TEST', policy: 'Proxy' },
      { __isFinal: true, type: 'FINAL', value: null, policy: 'Proxy' },
    ],
  };

  const config = `
[Rule]
DOMAIN, test.com, DIRECT
RULE-SET, https://test.co/foo/bar.list, REJECT-TINYGIF
AND, ((SRC-IP,192.168.1.110), (DOMAIN, example.com)), DIRECT
GEOIP, TEST, Proxy
FINAL, Proxy
`.trim();

  expect(parser.generate(json)).toBe(config);
});
