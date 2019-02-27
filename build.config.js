'use strict';

module.exports = ({
  env = 'production',
  node = false,
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
        alias: {
          'funk-lib': (env === 'test') ? './src' : '..',
        },
      }],
    ],
  };
};
