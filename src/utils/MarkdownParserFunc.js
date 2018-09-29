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
    // Blockquotes
    operation(
      /^>\s?([\w\n ]+)\n\n/gm,
      (text, token, idx, raw) => {
        const parsed = `<blockquote>\n${token[1]}\n</blockquote>\n`;
        return replace(text, parsed, idx, idx + raw.length);
      }
    ),
    // Double-symboled
    operation(
      /(\*\*|__|~~)([\w ]+)(\*\*|__|~~)/gm,
      (text, token, idx, raw) => {
        let type;
        switch (token[1]) {
          case '**': case '__':
            type = 'strong';
            break;
          case '~~':
            type = 'strike';
            break;
          default:
            return text;
        }
        const parsed = `<${type}>${token[2]}</${type}>`;
        return replace(text, parsed, idx, idx + raw.length);
      }
    ),
    // Single-symboled
    operation(
      /(\*|_|`)([A-Za-z0-9 ]+)(\*|_|`)/gm,
      (text, token, idx, raw) => {
        if (token[1] === '*' || token[1] === '_') {
          const parsed = `<i>${token[2]}</i>`;
          return replace(text, parsed, idx, idx + raw.length);
        }
        return text;
      }
    ),
    // Links and images
    operation(
      /(!?)\[([\w ]+)\]\(([:/\w%?&=\.]+)\)({([a-z_=" ]+)})?/gm,
      (text, token, idx, raw) => {
        let parsed;
        if (token[1]) {
          parsed = `<img src="${token[3]}" alt="${token[2]}" />`;
        } else {
          parsed = `<a href="${token[3]}"${token[5] ? ' ' + token[5] : ''}>${token[2]}</a>`;
        }
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
> this is something special
test one two three

another row with some data _italics_ and _another italics_
a text with [a link](https://goo.gl) or a link with [target](https://goo.gl){_target="blank"}
or a an ![image](https://goo.gl/logo.png) test
`;

console.log(MarkdownToHTML(text));
