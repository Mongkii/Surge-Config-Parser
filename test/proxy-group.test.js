const parser = require('../dist/index').default;

test('parse proxy group correctly', () => {
  const config = `
[Proxy Group]
Test Group = select, 1 2 3, ab c, 3)_#*)@$()
`;

  expect(parser.parse(config)).toStrictEqual({
    'Proxy Group': [
      {
        name: 'Test Group',
        type: 'select',
        proxies: ['1 2 3', 'ab c', '3)_#*)@$()'],
      },
    ],
  });
});

test('generate proxy group correctly', () => {
  const json = {
    'Proxy Group': [
      {
        name: 'Test Group',
        type: 'select',
        proxies: ['1 2 3', 'ab c', '3)_#*)@$()'],
      },
    ],
  };

  const result = `
[Proxy Group]
Test Group = select, 1 2 3, ab c, 3)_#*)@$()
`.trim();

  expect(parser.generate(json)).toBe(result);
});
