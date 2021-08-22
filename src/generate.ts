import type { ConfigJSON, GroupName, WriteToLog } from './types';

import type { LinesGenerator } from './utils';

import { generate as generateGeneral } from './sections/general';
import { generate as generateReplica } from './sections/replica';
import { generate as generateProxy } from './sections/proxy';
import { generate as generateProxyGroup } from './sections/proxy-group';
import { generate as generateRule } from './sections/rule';
import { generate as generateUrlRewrite } from './sections/url-rewrite';
import { generate as generateMITM } from './sections/mitm';

const generatorByGroupName: { [groupName in GroupName]: LinesGenerator<any> } = {
  General: generateGeneral,
  Replica: generateReplica,
  Proxy: generateProxy,
  'Proxy Group': generateProxyGroup,
  Rule: generateRule,
  'URL Rewrite': generateUrlRewrite,
  MITM: generateMITM,
};

const generate = (json: ConfigJSON, writeToLog: WriteToLog): string => {
  const groupConfigs = Object.entries(json).map(([groupName, data]) => {
    const title = `[${groupName}]`;

    const generator = generatorByGroupName[groupName as GroupName];
    const lines = generator(data, writeToLog);

    return [title, ...lines].join('\n');
  });

  return groupConfigs.join('\n\n');
};

export default generate;
