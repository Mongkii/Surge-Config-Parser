import { UrlRewrite } from '../types';
import { atomParsers, errMsg, LinesParser, removeComment } from './common';

const parseUrlRewrite: LinesParser<UrlRewrite[]> = (lines, writeToLog) => {
  const rawRewriteDatas = removeComment(lines).map(atomParsers.space);

  const urlRewrites: UrlRewrite[] = rawRewriteDatas
    .map(([from, to, mode]) => {
      if (!(from && to)) {
        writeToLog(errMsg('URL Rewrite', `Unsupported rule: "${from} ${to}"`));
        return null;
      }
      const urlRewrite: UrlRewrite = { from, to };
      if (mode) {
        urlRewrite.mode = mode;
      }
      return urlRewrite;
    })
    .filter((urlRewrite): urlRewrite is UrlRewrite => Boolean(urlRewrite));

  return urlRewrites;
};

export default parseUrlRewrite;
