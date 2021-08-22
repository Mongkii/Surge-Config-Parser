import { Rule, FinalRule, NonFinalRule } from '../types';
import { atomGenerators, errMsg, ScopeGenerator, ScopeParser, removeComment } from '../utils';

// Rule supports complex like "AND,((SRC-IP,192.168.1.110), (DOMAIN, example.com)),DIRECT".
// It should be split to "AND", "((SRC-IP,192.168.1.110), (DOMAIN, example.com))", "DIRECT"
// So we can't just split by comma (like what happens in atomParsers.comma)
const ruleCommaParser = (text: string): string[] => {
  let leftBracketCount = 0;
  let curPiece = '';
  const pieces: string[] = [];

  const textLen = text.length;
  for (let i = 0; i < textLen; i += 1) {
    const curLetter = text[i];

    if (curLetter === ',' && leftBracketCount < 1) {
      pieces.push(curPiece);
      curPiece = '';
      continue;
    }

    curPiece += curLetter;
    if (curLetter === '(') {
      leftBracketCount += 1;
    }
    if (curLetter === ')') {
      leftBracketCount -= 1;
    }
  }

  pieces.push(curPiece);
  return pieces.map((piece) => piece.trim());
};

export const parse: ScopeParser<Rule[]> = (lines, writeToLog) => {
  const ruleDatas = removeComment(lines).map(ruleCommaParser);

  const parsed: Rule[] = ruleDatas
    .map(([type, ...restData]) => {
      if (!type) {
        writeToLog(errMsg('Rule', `Unsupported rule: "${[type, ...restData].join(',')}"`));
        return null;
      }
      if (type === 'FINAL') {
        const [policy] = restData;
        const finalRule: FinalRule = { __isFinal: true, type, value: null, policy: policy || '' };
        return finalRule;
      }
      const [value, policy] = restData;
      const nonFinalRule: NonFinalRule = {
        type,
        value: value || '',
        policy: policy || '',
      };
      return nonFinalRule;
    })
    .filter((rule): rule is Rule => Boolean(rule));

  return parsed;
};

export const generate: ScopeGenerator<Rule[]> = (data, writeToLog) =>
  data
    .filter((rule) => Boolean(rule.type))
    .map((rule) => atomGenerators.comma([rule.type, rule.value, rule.policy]));
