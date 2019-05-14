# funk-lib

Functional JavaScript Library

[![ci](https://img.shields.io/circleci/project/github/colbydauph/funk-lib/master.svg)](https://circleci.com/gh/colbydauph/funk-lib/tree/master)
[![npm module](https://badge.fury.io/js/funk-lib.svg)](https://www.npmjs.org/package/funk-lib)
[![npm downloads](https://img.shields.io/npm/dw/funk-lib.svg)](https://www.npmjs.org/package/funk-lib)

## Features

**Pure functions**

*Mostly*. There are a few documented exceptions


**[Curried](https://ramdajs.com/docs/#curry) arguments**

Arranged "data last" for useful partial application


**Isomorphic**

Dual-transpiled for [`commonjs`](https://www.npmjs.com/package/funk-lib) (Node.js) or [`es-modules`](https://www.npmjs.com/package/funk-lib-es) (browser)


For a full list of functions see the [Documentation For The Latest Release](https://funk-lib.com).


## Install
```shell
npm i -P funk-lib
# or: es-module compatible build
npm i -P funk-lib-es
```

## Import
```javascript
const { mapKeys } = require('funk-lib/object');
// or: es-module compatible build
import { mapKeys } from 'funk-lib-es/object';
```


## Development

#### Commands

`$ npm run <command>`

| command      | description   |
|--------------|---------------|
| `build`      | Transpile source |
| `cover`      | Run test coverage |
| `init`       | Re/Install deps |
| `init:hard`  | `init` with a fresh `package-lock` |
| `docs`       | Parse docs to `JSON` |
| `lint`       | Lint the source |
| `test`       | Run tests |
| `test:watch` | Run tests on change |
| `verify`     | Verify linting, tests, coverage |