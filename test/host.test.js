const parser = require('../dist/index').default;

test('parse host correctly', () => {
  const config = `
[Host]
a=
ab = 1
abc.com=1.1.1.1
*.abc.com = server:syslib
`;

  expect(parser.parse(config)).toStrictEqual({
    Host: {
      ab: '1',
      'abc.com': '1.1.1.1',
      '*.abc.com': 'server:syslib',
    },
  });
});

test('generate host correctly', () => {
  const json = {
    Host: {
      '': '',
      a: '',
      'abc.a': '1.1.1.1',
      '*.abc.com': 'server:syslib',
    },
  };

  const result = `
[Host]
abc.a = 1.1.1.1
*.abc.com = server:syslib
  `.trim();

  expect(parser.generate(json)).toBe(result);
});
