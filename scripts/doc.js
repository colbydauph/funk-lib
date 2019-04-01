/* eslint-disable no-console */
'use strict';

const R = require('ramda');
const prefix = '/Users/colby/Development/funk-lib/src';

const SOURCE_HOST = 'https://github.com/colbydauph/funk-lib/blob/feat-docs/src';

const toString = async stream => {
  return new Promise((resolve, reject) => {
    const chunks = [];
    /* eslint-disable indent */
    stream.on('data', (chunk) => chunks.push(chunk.toString()))
          .on('end', () => resolve(chunks.join('')))
          .on('error', reject);
    /* eslint-enable indent */
  });
};

// eslint-disable-next-line max-statements
const parseDoc = ({
  name,
  kind,
  undocumented = false,
  examples = [],
  description = '',
  deprecated = false,
  ignore = false,
  tags = [],
  meta = {},
}) => {
    
  if (undocumented) return {};
  if (kind === 'package') return {};
  if (/\.test\.js$/.test(meta.filename)) return {};

  const parentPath = (meta.filename === 'index.js')
    ? []
    : [R.head(R.split('.', meta.filename))];
  
  const relative = meta.path.replace(prefix, '');
  
  const modulePath = relative
    .replace(/^\/|\/$/, '')
    .split('/')
    .filter(R.identity);
    
  const { filename, lineno } = meta;
  const url = `${ SOURCE_HOST }${ relative }/${ filename }#L${ lineno }`;
  
  const key = [...modulePath, ...parentPath, name].join('/');
  
  return {
    [key]: {
      ...tags.reduce((out, tag) => {
        return R.assoc(tag.title, tag.text, out);
      }, {}),
      description,
      examples,
      kind,
      deprecated,
      url,
      ignore,
    },
  };
  
};

toString(process.stdin)
  .then(JSON.parse)
  // eslint-disable-next-line max-statements
  .then(R.reduce((out, doc) => ({
    ...out,
    ...parseDoc(doc),
  }), {}))
  .then(R.tap(obj => console.log(JSON.stringify(obj, null, 2))))
  .catch(console.error);
