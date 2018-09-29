'use strict';

const operation = (lexer, parser, cacheInit) => (text) => {
  let cache = cacheInit;
  let token;

  while (token = lexer.exec(text)) {
    text = parser(text, token, token.index, token[0], cache);
  }

  return text;
}

const replace = (text, witht, from, to) =>
  text.substring(0, from) + witht + text.substring(to, text.length);

// More functionally-inspired parser
const MarkdownToHTML = md =>
  [
    // Headings
    operation(
      /^(#+)\s?([\w ]+)\n/gm,
      (text, token, idx, raw) => {
        const type = 6 - token[1].length;
        if (0 < type && type < 7) {
          const parsed = `<h${type}>${token[2]}</h${type}>\n`;
          return replace(text, parsed, idx, idx + raw.length);
        }
        return text;
      }
    ),
    // Double-symboled
    operation(
      /(\*\*|__|~~)([\w ]+)(\*\*|__|~~)/gm,
      (text, token, idx, raw) => {
        let type;
        switch (token[1]) {
          case '**': case '__': default:
            type = 'strong';
            break;
          case '~~':
            type = 'strike';
            break;
        }
        const parsed = `<${type}>${token[2]}</${type}>`;
        return replace(text, parsed, idx, idx + raw.length);
      }
    )
  ]
  .reduce(
    (prev, next) => next(prev),
    md.replace(/\r\n/g, '\n')
  );

const text = `
this is a random string **should be bold** and hahaha **and this** **too** thats it
#### heading somehting
# some text
`;

console.log(MarkdownToHTML(text));
