const parser = require('../dist/index').default;

test('parse replica correctly', () => {
  const config = `
[Replica]
hide-apple-request = true
hide-crashlytics-request = true
use-keyword-filter = false
hide-udp = false
`;

  expect(parser.parse(config)).toStrictEqual({
    Replica: {
      'hide-apple-request': true,
      'hide-crashlytics-request': true,
      'use-keyword-filter': false,
      'hide-udp': false,
    },
  });
});

test('log unsupported config', () => {
  const config = `
[Replica]
random-eb956487 = 1
  `;

  let log = ``;
  const setLog = (text) => (log = text);
  parser.parse(config, { log: setLog });

  expect(log).toBe('[ERROR in Replica] Unsupported config: random-eb956487, value: 1');
});
