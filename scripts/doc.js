/* eslint-disable no-console */
'use strict';

const path = require('path');
const R = require('ramda');
const fs = require('fs');
const { writeFile }  = require('funk-fs');
const prefix = '/Users/colby/Development/funk-lib/src';

const awaitPiped = async () => {
  return new Promise((resolve, reject) => {
    const { stdin } = process;
    
    let data = '';
    stdin.on('readable', () => {
      const chunk = stdin.read();
      if (!chunk) return;
      data += chunk;
    });
    stdin.on('end', () => resolve(JSON.parse(data.trim())));
  });
};

const toHTML = (modules) => {
  const main = Object
    .entries(modules)
    .map(([module, members]) => {
      return `
        <div>
          <h1>${ module }</h1>
          <ul>${
  Object.entries(members).map(([member, spec]) => {
    return `
  <li>
    <h2>${ member }</h2>
    <div>${ spec.kind }</div>
    <code>${ spec.sig }</code>
    <div>${ spec.description }</div>
    <div>${ (spec.deprecated ? 'deprecated' : '') }</div>
    <ul>${
  spec.examples.map(example => `<li><code>${ example }</code></li>`).join('')
}</ul>
  </li>
              `;
  })
    .join('')
}</ul>
        </div>
`;
    })
    .join('');
    
  return `
    <html>
      <head></head>
      <body>
        ${ main }
      </body>
    </html>
`;
};
const SOURCE_HOST = 'https://github.com/colbydauph/funk-lib/blob/feat-docs/src';

awaitPiped()
  // eslint-disable-next-line max-statements
  .then(R.reduce((out, doc) => {
      
    const {
      name,
      kind,
      undocumented,
      examples = [],
      description = '',
      deprecated,
    } = doc;
    if (undocumented) return out;
    
    if (kind === 'package') return out;
    if (/\.test\.js$/.test(doc.meta.filename)) return out;
    if (kind === 'module') return out;
    
    const parentPath = (doc.meta.filename === 'index.js')
      ? []
      : [R.head(R.split('.', doc.meta.filename))];
    
    const relative = doc.meta.path.replace(prefix, '');
    
    const modulePath = relative
      .replace(/^\/|\/$/, '')
      .split('/');
      
    const tags = doc.tags.reduce((out, tag) => {
      return R.assoc(tag.title, tag.text, out);
    }, {});

    const { filename, lineno } = doc.meta;
    const url = `${ SOURCE_HOST }${ relative }/${ filename }#L${ lineno }`;
    return R.over(
      R.lensProp([...modulePath, ...parentPath, name].join('/')),
      _ => ({ ...tags, description, examples, kind, deprecated, url }),
      out
    );
    
  }, {}))
  .then(R.tap(obj => console.log(JSON.stringify(obj, null, 2))))
  // .then(toHTML)
  // .then(html => writeFile(
  //   html,
  //   path.join(__dirname, '../doc.html'),
  //   fs
  // ))
  // .then(console.log)
  .catch(console.error);
