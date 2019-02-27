module.exports =  ({
  env = 'production',
  node = true,
} = {}) => {
  
  const envPreset = node
    ? ['@babel/env', { targets: { node: '8.10' } }]
    : ['@babel/env', {
      targets: {
        browsers: ['last 2 versions'],
      },
      modules: false,
    }];

  return {
    comments: false,
    presets: [envPreset],
    plugins: [
      '@babel/plugin-proposal-export-namespace-from',
    ],
  };
};
