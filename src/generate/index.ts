import type { ConfigJSON, WriteToLog } from '../types';

const generate = (json: ConfigJSON, writeToLog: WriteToLog): string => {
  console.log(json);
  return '';
};

export default generate;
