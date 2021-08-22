import { UrlRewrite } from '../types';
import {
  atomGenerators,
  atomParsers,
  errMsg,
  LinesGenerator,
  LinesParser,
  removeComment,
} from '../utils';

export const parse: LinesParser<UrlRewrite[]> = (lines, writeToLog) => {
  const rawRewriteDatas = removeComment(lines).map(atomParsers.space);

  const parsed: UrlRewrite[] = rawRewriteDatas
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

  return parsed;
};

export const generate: LinesGenerator<UrlRewrite[]> = (data, writeToLog) =>
  data
    .filter(({ from, to }) => Boolean(from && to))
    .map(({ from, to, mode }) => atomGenerators.space([from, to, mode]));
