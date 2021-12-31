'use strict';

// modules
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

// local
const config = require('../build.config');
const { name } = require('../package.json');

// eslint-disable-next-line no-process-env
const { NODE_ENV: env } = process.env;

chai.use(chaiAsPromised);

// used by mocha to transpile modules on-the-fly
require('@babel/register')(config({
  env,
  node: true,
  alias: { [name]: './src' },
}));
