const parser = require('../dist/index').default;

test('parse url rewrite correctly', () => {
  const config = `
[URL Rewrite]
^http://www\.google\.cn http://www.google.com
^http://ad\.com/ad\.png _ reject
`;

  expect(parser.parse(config)).toStrictEqual({
    'URL Rewrite': [
      {
        from: '^http://www.google.cn',
        to: 'http://www.google.com',
      },
      {
        from: '^http://ad.com/ad.png',
        to: '_',
        mode: 'reject',
      },
    ],
  });
});

test('warn on unsupported url rewrite rule', () => {
  const config = `
[URL Rewrite]
^http://www\.google\.cn   
`;

  let errMsg = '';
  parser.parse(config, {
    log: (log) => {
      errMsg = log;
    },
  });
  expect(errMsg).toBe('[ERROR in URL Rewrite] Unsupported rule: "^http://www\.google\.cn undefined"');
});
