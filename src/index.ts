import type { ConfigJSON, WriteToLog, ParseOptions } from './types';

import parse from './parse';
import generate from './generate';

const surgeConfigParser = {
  /**
   * parse Surge config to JSON
   * @param config Surge Config
   * @param parseOptions Parse Options
   * @returns parsed JSON
   */
  parse: (config: string, parseOptions: ParseOptions = {}): ConfigJSON => {
    const logLines: string[] = [];
    const writeToLog: WriteToLog = (msg) => {
      logLines.push(msg);
    };

    const json = parse(config, writeToLog);
    parseOptions.log?.(logLines.join('\n'));

    return json;
  },
  /**
   * generate Surge config from JSON
   * @param json parsed JSON
   * @returns Surge Config
   */
  generate: (json: ConfigJSON): string => generate(json),
};

export default surgeConfigParser;
