import type { ConfigJSON, ScopeName, WriteToLog } from './types';
import type { ScopeParser } from './utils';

import { parse as parseGeneral } from './scopes/general';
import { parse as parseReplica } from './scopes/replica';
import { parse as parseProxy } from './scopes/proxy';
import { parse as parseProxyGroup } from './scopes/proxy-group';
import { parse as parseRule } from './scopes/rule';
import { parse as parseUrlRewrite } from './scopes/url-rewrite';
import { parse as parseMITM } from './scopes/mitm';

interface LineGroup {
  name: ScopeName;
  lines: string[];
}
/** Group config text lines by [XXX] scopeName */
const groupLines = (config: string): LineGroup[] => {
  const lines = config
    .trim()
    .split('\n')
    .map((line) => line.trim());

  if (lines.length < 1) {
    return [];
  }

  const result: LineGroup[] = [];
  let curGroup: LineGroup | null = null;

  lines.forEach((line) => {
    const isScopeNameLine = line.startsWith('[') && line.endsWith(']');

    if (isScopeNameLine) {
      // Add previous 'currrent group' to result and replace it with a new one.
      if (curGroup) {
        result.push(curGroup);
      }
      curGroup = { name: line.slice(1, -1) as ScopeName, lines: [] };
      return;
    }

    if (!curGroup || !line) {
      return;
    }
    curGroup.lines.push(line);
  });

  // The last 'current group' is not added automatically.
  if (curGroup) {
    result.push(curGroup);
  }

  return result;
};

const parserByScope: { [scope in ScopeName]: ScopeParser<any> } = {
  General: parseGeneral,
  Replica: parseReplica,
  Proxy: parseProxy,
  'Proxy Group': parseProxyGroup,
  Rule: parseRule,
  'URL Rewrite': parseUrlRewrite,
  MITM: parseMITM,
};

const parse = (config: string, writeToLog: WriteToLog): ConfigJSON => {
  const lineGroups = groupLines(config);

  const configJSON: ConfigJSON = {};

  lineGroups.forEach(({ name, lines }) => {
    const parser = parserByScope[name];

    if (!parser) {
      writeToLog(`Unsupported Config Scope: ${name}`);
      return;
    }
    configJSON[name] = parser(lines, writeToLog);
  });

  return configJSON;
};

export default parse;
