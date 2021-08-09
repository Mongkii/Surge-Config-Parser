export const fromEntries = <T = any>(entries: [string, T][]): { [k: string]: T } => {
  const result: { [k: string]: T } = {};

  entries.forEach(([key, value]) => {
    result[key] = value;
  });

  return result;
};
