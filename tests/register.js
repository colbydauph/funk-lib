'use strict';

const config = require('../babelconf.js');

/* eslint-disable no-process-env */
const { NODE_ENV: env } = process.env;
/* eslint-enable no-process-env */

require('@babel/register')(config({
  env,
  node: true,
}));
