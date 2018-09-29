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
      /^(#+) ?([\w ]+)\n/gm,
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
      /^> ?([\w\n ]+)\n\n/gm,
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
        let parsed = '';
        switch (token[1]) {
          case '*': case '_':
            parsed = `<i>${token[2]}</i>`;
            break;
          case '`':
            parsed = `<span class="code">${token[2]}</span>`;
            break;
          default:
            return text;
        }
        return replace(text, parsed, idx, idx + raw.length);
      }
    ),
    // Code blocks
    operation(
      /^```([a-z\-])?\n([\w\n ]+)^```\n\n/gm,
      (text, token, idx, raw) => {
        const parsed = `<code${token[1] ? `data-lang="${token[1]}"` : ''}>\n${token[2]}</code>\n`;
        return replace(text, parsed, idx, idx + raw.length);
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
    ),
    // Horizontal lines
    operation(
      /\n^(-|=){3,}\n\n/gm,
      (text, _, idx, raw) => {
        return replace(text, '<hr />\n', idx, idx + raw.length);
      }
    ),
    // Lists
    operation(
      /(^(-|(\d\.)) ([\w ]+)\n)|(\n\n)/gm,
      (text, token, idx, raw, cache) => {
        if (token[1]) {
          cache.type = token[2] === '-' ? 'ul' : 'ol';
          if (!cache.rows.length) {
            cache.idx = idx;
          }
          cache.rows.push(`<li>${token[4]}</li>`);
        } else if (token[5] && cache.rows.length) {
          const { type, rows } = cache;
          const parsed = `<${type}>\n${rows.join('\n')}\n</${type}>\n`

          text = replace(text, parsed, cache.idx, idx + raw.length);

          cache.type = '';
          cache.rows = [];
          cache.idx = 0;
        }
        return text;
      },
      { type: '', rows: [], idx: 0 }
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

another \`code\` with some data _italics_ and _another italics_
a text with [a link](https://goo.gl) or a link with [target](https://goo.gl){_target="blank"}
or a an ![image](https://goo.gl/logo.png) test
\`\`\`
some code here
you know
\`\`\`

some text again

---

another one
test two

====

some text

- list item 1
- list item 2
- list item 3


1. List or 1
2. List or 2
3. List or 3


some text
`;

console.log(MarkdownToHTML(text));
