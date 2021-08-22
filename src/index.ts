import type { ConfigJSON, WriteToLog, ParseOptions, GenerateOptions } from './types';

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
   * @param generateOptions Generate Options
   * @returns Surge Config
   */
  generate: (json: ConfigJSON, generateOptions: GenerateOptions = {}): string => {
    const logLines: string[] = [];
    const writeToLog: WriteToLog = (msg) => {
      logLines.push(msg);
    };

    const config = generate(json, writeToLog);
    generateOptions.log?.(logLines.join('\n'));

    return config;
  },
};

export default surgeConfigParser;
