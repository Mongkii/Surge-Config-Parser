import type { ConfigJSON, GroupName, WriteToLog } from './types';
import type { LinesParser } from './utils';

import { parse as parseGeneral } from './sections/general';
import { parse as parseReplica } from './sections/replica';
import { parse as parseProxy } from './sections/proxy';
import { parse as parseProxyGroup } from './sections/proxy-group';
import { parse as parseRule } from './sections/rule';
import { parse as parseUrlRewrite } from './sections/url-rewrite';
import { parse as parseMITM } from './sections/mitm';

interface LineGroup {
  name: GroupName;
  lines: string[];
}
/** Group config text lines by [XXX] groupName */
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
    const isGroupNameLine = line.startsWith('[') && line.endsWith(']');

    if (isGroupNameLine) {
      // Add previous 'currrent group' to result and replace it with a new one.
      if (curGroup) {
        result.push(curGroup);
      }
      curGroup = { name: line.slice(1, -1) as GroupName, lines: [] };
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

const linesParserByGroupName: { [groupName in GroupName]: LinesParser<any> } = {
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
    const linesParser = linesParserByGroupName[name];

    if (!linesParser) {
      writeToLog(`Unsupported Config Scope: ${name}`);
      return;
    }
    configJSON[name] = linesParser(lines, writeToLog);
  });

  return configJSON;
};

export default parse;
