'use strict';

const construction = (lexer, parser, cacheInit) => (text) => {
  let cache = cacheInit;
  let token;

  while (token = lexer.exec(text)) {
    text = parser(text, token, token.index, token[0], cache);
  }

  return text;
}

const replace = (text, witht, from, to) =>
  text.substring(0, from) + witht + text.substring(to, text.length);

// More functionally-inspired parser; Probably not-fully-compliant with standard
// Notable issues: Lists require one additional new line in the end in (regexp)
// To-dos: Improve content regexp
export const MarkdownToHTML = md =>
  [
    // Headings
    construction(
      /^\s+?(#+) ?([\w ]+)\n/gm,
      (text, token, idx, raw) => {
        const type = token[1].length;
        if (0 < type && type < 7) {
          const parsed = `<h${type}>${token[2]}</h${type}>\n`;
          return replace(text, parsed, idx, idx + raw.length);
        }
        return text;
      }
    ),
    // Blockquotes
    construction(
      /^> ?([\w\n ]+)\n\n/gm,
      (text, token, idx, raw) => {
        const parsed = `<blockquote>\n${token[1]}\n</blockquote>\n`;
        return replace(text, parsed, idx, idx + raw.length);
      }
    ),
    // Double-symboled
    construction(
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
    construction(
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
    construction(
      /^```([a-z\-])?\n([\w\n ]+)^```\n\n/gm,
      (text, token, idx, raw) => {
        const parsed = `<code${token[1] ? `data-lang="${token[1]}"` : ''}>\n${token[2]}</code>\n`;
        return replace(text, parsed, idx, idx + raw.length);
      }
    ),
    // Links and images
    construction(
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
    // Horizontal rulers
    construction(
      /\n^(-|=){3,}\n\n/gm,
      (text, _, idx, raw) => {
        return replace(text, '<hr />\n', idx, idx + raw.length);
      }
    ),
    // Lists
    construction(
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
    ),
    // Boxes (custom)
    construction(
      /^::{([:/\w%?&=\.]+)}\(([#\w\n</> ]+)\)/gm,
      (text, token, idx, raw) => {
        const parsed = `<div class="box"><img src="${token[1]}" /><div class="ctnt">${token[2]}</div></div>`;
        return replace(text, parsed, idx, idx + raw.length);
      }
    )
  ]
  .reduce(
    (prev, next) => next(prev),
    md.replace(/\r\n/g, '\n')
  );
