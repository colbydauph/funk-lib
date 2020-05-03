# funk-lib

[![ci](https://img.shields.io/circleci/project/github/colbydauph/funk-lib/master.svg)](https://circleci.com/gh/colbydauph/funk-lib/tree/master)
[![npm module](https://badge.fury.io/js/funk-lib.svg)](https://www.npmjs.org/package/funk-lib)
[![npm downloads](https://img.shields.io/npm/dw/funk-lib.svg)](https://www.npmjs.org/package/funk-lib)

## FP for Vanilla JavaScript

`funk-lib` is a collection of functions for working with native JavaScript types in a consistent, functional way. It is heavily inspired by [`Ramda`](https://ramdajs.com), but does not duplicate Ramda's functionality.

For a full list of functions see the [Documentation For The Latest Release](https://funk-lib.com)


## Features

**Pure functions**

*Mostly*. There are a few documented exceptions
s

**Currying**

All functions are [curried]((https://ramdajs.com/docs/#curry)), and arguments are arranged "data last" for useful partial application


**Isomorphic**

Packages are available for both
- `Node.js` (CommonJS) - [`npm/funk-lib`](https://www.npmjs.com/package/funk-lib)
- `Browser` (ES Modules) - [`npm/funk-lib-es`](https://www.npmjs.com/package/funk-lib-es)


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