/* istanbul ignore file */
'use strict';

const srcRoot = ({ env, node }) => {
  if (env === 'test') return './src';
  if (node) return './dist/cjs';
  return './dist/es';
};

module.exports = ({
  env = 'production',
  node = false,
  alias = {},
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
      ['module-resolver', {
        root: ['.'],
        alias: {
          ...alias,
          'funk-lib': srcRoot({ env, node }),
        },
      }],
    ],
  };
};
