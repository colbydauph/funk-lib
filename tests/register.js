'use strict';

const config = require('../build.config');

// eslint-disable-next-line no-process-env
const { NODE_ENV: env } = process.env;

// used by mocha to transpile modules on-the-fly
require('@babel/register')(config({
  env,
  node: true,
}));
