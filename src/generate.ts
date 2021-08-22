import type { ConfigJSON, ScopeName, WriteToLog } from './types';

import type { ScopeGenerator } from './utils';

import { generate as generateGeneral } from './scopes/general';
import { generate as generateReplica } from './scopes/replica';
import { generate as generateProxy } from './scopes/proxy';
import { generate as generateProxyGroup } from './scopes/proxy-group';
import { generate as generateRule } from './scopes/rule';
import { generate as generateUrlRewrite } from './scopes/url-rewrite';
import { generate as generateMITM } from './scopes/mitm';

const generatorByScope: { [scope in ScopeName]: ScopeGenerator<any> } = {
  General: generateGeneral,
  Replica: generateReplica,
  Proxy: generateProxy,
  'Proxy Group': generateProxyGroup,
  Rule: generateRule,
  'URL Rewrite': generateUrlRewrite,
  MITM: generateMITM,
};

const generate = (json: ConfigJSON, writeToLog: WriteToLog): string => {
  const groupConfigs = Object.entries(json).map(([scope, data]) => {
    const title = `[${scope}]`;

    const generator = generatorByScope[scope as ScopeName];
    if (!generator) {
      writeToLog(`Unsupported Config Scope: ${scope}`);
      return;
    }

    const lines = generator(data, writeToLog);

    return [title, ...lines].join('\n');
  });

  return groupConfigs.join('\n\n');
};

export default generate;
