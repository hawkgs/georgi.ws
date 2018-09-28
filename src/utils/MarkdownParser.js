'use strict';

const printToken = console.log;

const createSignValueToken = (s, v, t) => {
  if (!s || !v) {
    return null;
  }
  return { sign: s, value: v, index: t.index, raw: t[0] };
};

const createSignToken = (s, t) => {
  if (!s) {
    return null;
  }
  return { sign: s, index: t.index, raw: t[0] };
}

// Disclaimer: MD not-fully-compliant parser; Not super optimized; Probably buggy
const MarkdownToHTML = (md) => {
  const lexer = /(^(#+)\s?([\w\s]+)\n)|(^(>)\s?([\w\s]+)\n)|((\*\*|__|~~)([\w\s]+)(\*\*|__|~~))|((\*|_|`)([\w\s]+)(\*|_|`))|((!?)\[([\w\s]+)\]\(([:/\w%?&=\.]+)\))/gm;

  md = md.replace('\r\n', '\n');
  const listCache = [];
  let token;

  // hline: (^((-|=){3,})\n)

  while (token = lexer.exec(md)) {
    const headings = createSignValueToken(token[2], token[3], token);
    const quotes = createSignValueToken(token[5], token[6], token);
    const doubleSymboled = createSignValueToken(token[8], token[9], token);
    const singleSymboled = createSignValueToken(token[12], token[13], token);
    const link = createSignValueToken(token[16] ? 'img' : 'link', { attr: token[17], src: token[18] }, token);
    // const hline = createSignToken(token[16], token);

    if (headings) {
      printToken(headings);
    } else if (quotes) {
      printToken(quotes);
    } else if (doubleSymboled) {
      printToken(doubleSymboled);
    } else if (singleSymboled) {
      printToken(singleSymboled);
    } else if (link) {
      printToken(link);
    }
  }
};

const file = `
###### another is nafta
###### another one
------
======
--
==
> this is a new text ![img_atr](http://google.com)
###### jjaja divan
this [linky](http://link.com) is some **sort** of a ~~text~~ __ur__ where something \`lol\` _lmao_ rstar
`;

MarkdownToHTML(file);
