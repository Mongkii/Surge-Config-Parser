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
