import { Host } from '../types';
import {
  atomGenerators,
  atomParsers,
  ScopeGenerator,
  ScopeParser,
  removeComment,
  fromEntries,
} from '../utils';

export const parse: ScopeParser<Host> = (lines, writeToLog) => {
  const hostDatas = removeComment(lines).map(atomParsers.assign);

  const parsed: Host = fromEntries(hostDatas.filter(([key, value]) => Boolean(key && value)));

  return parsed;
};

export const generate: ScopeGenerator<Host> = (data, writeToLog) =>
  Object.entries(data)
    .filter(([key, value]) => Boolean(key && value))
    .map((keyValue) => atomGenerators.assign(keyValue));
