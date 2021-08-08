import type { ConfigJSON } from './types';

import parse from './parse';
import generate from './generate';

const surgeConfigParser = {
  /**
   * parse Surge config to JSON
   * @param config Surge Config
   * @returns parsed JSON
   */
  parse: (config: string): ConfigJSON => parse(config),
  /**
   * generate Surge config from JSON
   * @param json parsed JSON
   * @returns Surge Config
   */
  generate: (json: ConfigJSON): string => generate(json),
};

export default surgeConfigParser;
