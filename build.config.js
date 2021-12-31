/* istanbul ignore file */
'use strict';

const parseNodeVersion = version => (/[^\d]+(.+)$/.exec(version) || [])[1];

module.exports = ({
  env = 'production',
  node = false,
  alias = {},
  ...rest
} = {}) => {
  
    
  const envConfig = node
    ? { targets: { node: parseNodeVersion(node) } }
    : {
      targets: { browsers: ['last 2 versions'] },
      modules: false,
    };

  return {
    comments: false,
    presets: [
      ['@babel/env', envConfig],
    ],
    plugins: [
      '@babel/plugin-proposal-export-namespace-from',
      'ramda',
      ['module-resolver', {
        root: ['.'],
        alias,
      }],
    ],
  };
};
