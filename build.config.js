/* istanbul ignore file */
'use strict';

module.exports = ({
  env = 'production',
  node = false,
  alias = {},
  ...rest
} = {}) => {
    
  const envConfig = node
    ? { targets: { node } }
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
