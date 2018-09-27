'use strict';

export const MD_TEXT = 'MD_TEXT';
export const MD_QUOTE = 'MD_QUOTE';
export const MD_EXCLAMATION = 'MD_EXCLAMATION';
export const MD_LEFT_RBRACKET = 'MD_LEFT_RBRACKET';
export const MD_RIGHT_RBRACKET = 'MD_RIGHT_RBRACKET';
export const MD_LEFT_SBRACKET = 'MD_LEFT_SBRACKET';
export const MD_RIGHT_SBRACKET = 'MD_RIGHT_SBRACKET';
export const MD_DOT = 'MD_DOT';
export const MD_COMMENT = 'MD_COMMENT';
export const MD_NEWLINE = 'MD_NEWLINE';

export const MD_HEADING_1 = 'MD_HEADING_1';
export const MD_HEADING_2 = 'MD_HEADING_2';
export const MD_HEADING_3 = 'MD_HEADING_3';
export const MD_HEADING_4 = 'MD_HEADING_4';
export const MD_HEADING_5 = 'MD_HEADING_5';
export const MD_HEADING_6 = 'MD_HEADING_6';
export const MD_MULTILINE_CODE = 'MD_MULTILINE_CODE';
export const MD_INLINE_CODE = 'MD_INLINE_CODE';
export const MD_HLINE = 'MD_HLINE';
export const MD_ITALICS_AST = 'MD_ITALICS_AST';
export const MD_ITALICS_UND = 'MD_ITALICS_UND';
export const MD_BOLD_AST = 'MD_BOLD_AST';
export const MD_BOLD_UND = 'MD_BOLD_UND';
export const MD_STRIKETHROUGH = 'MD_STRIKETHROUGH';

const NonIncrementable = {
  '>': MD_QUOTE,
  '!': MD_EXCLAMATION,
  '(': MD_LEFT_RBRACKET,
  ')': MD_RIGHT_RBRACKET,
  '[': MD_LEFT_SBRACKET,
  ']': MD_RIGHT_SBRACKET,
  '.': MD_DOT,
  '\\': MD_COMMENT,
  '\n': MD_NEWLINE
};

const Incrementable = {
  [MD_HEADING_1]: '######',
  [MD_HEADING_2]: '#####',
  [MD_HEADING_3]: '####',
  [MD_HEADING_4]: '###',
  [MD_HEADING_5]: '##',
  [MD_HEADING_6]: '#',
  [MD_MULTILINE_CODE]: '```',
  [MD_INLINE_CODE]: '`',
  [MD_HLINE]: '---',
  [MD_ITALICS_AST]: '*',
  [MD_ITALICS_UND]: '_',
  [MD_BOLD_AST]: '**',
  [MD_BOLD_UND]: '__',
  [MD_STRIKETHROUGH]: '~~'
};

const collectCache = (cache) => {
  const seq = cache.join();

  if (seq) {
    for (let type in Incrementable) {
      const value = Incrementable[type];
      if (value === seq) {
        return { type, value };
      }
    }
    return { type: MD_TEXT, value: seq };
  }
  return null;
}

export const markdownLexer = (string) => {
  const tokens = [];
  const cache = [];

  const charIncrementor = (char, max) => {
    if (cache.length && cache.indexOf(char) !== -1 || cache.length === max) {
      const token = collectCache(token);
      if (token) {
        tokens.push(token);
        cache = [];
      }
    }
    cache.push(char);
  };

  for (let i; i < string.length; i += 1) {
    const c = string[i];

    switch (string[i]) {
      case '#':
        charIncrementor(c, 6);
        break;
      case '`':
      case '-':
        charIncrementor(c, 3);
        break;
      case '_':
      case '*':
      case '~':
        charIncrementor(c, 2);
        break;
      case '>':
      case '!':
      case '[':
      case ']':
      case '(':
      case ')':
      case '.':
      case '\\':
      case '\n':
        const token = collectCache(cache);
        if (token) {
          tokens.push(token);
          cache = [];
        }
        tokens.push({ type: NonIncrementable[c], value: c });
        break;
      default:
        cache.push(c);
        break;
    }

    if (i === string.length - 1) {
      const token = collectCache(cache);
      if (token) {
        tokens.push(token);
      }
    }
  }

  return tokens;
};
