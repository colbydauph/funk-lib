# funk-lib

[![ci](https://img.shields.io/circleci/project/github/colbydauph/funk-lib/master.svg)](https://circleci.com/gh/colbydauph/funk-lib/tree/master)
[![npm module](https://badge.fury.io/js/funk-lib.svg)](https://www.npmjs.org/package/funk-lib)
[![test coverage](https://img.shields.io/badge/test%20coverage-97%25-success)](https://circleci.com/gh/colbydauph/funk-lib/tree/master)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue)](https://circleci.com/gh/colbydauph/funk-lib/tree/master)

## FP for Vanilla JavaScript

`funk-lib` is a standard library for full-stack functional programming with native JavaScript types. It is inspired by [`Ramda`](https://ramdajs.com), but does not intend to duplicate Ramda's functionality. There is some overlap with core `Browser` and `Node.js` APIs, for the sake of normalization and isomorphism.


## Features

**Pure functions**

*Mostly*. There are a few documented exceptions

**Currying**

All functions are [curried](https://ramdajs.com/docs/#curry), and arguments are arranged "data last" for useful partial application

**Isomorphic**

Packages are available for both
- `Node.js` (CommonJS) - [`npm/funk-lib`](https://www.npmjs.com/package/funk-lib)
- `Browser` (ES Modules) - [`npm/funk-lib-es`](https://www.npmjs.com/package/funk-lib-es)

**Vast**

Includes over 300 functions for working with
- Async (promises)
- Iterables (sync & async)
- Type checking
- Arrays and objects
- Scalars (string, number)
- Function composition
- URLs
- ... and more

For a full list of functions see the [Documentation For The Latest Release](https://funk-lib.com)

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


<br />
<p style="text-align: center;">
  Created by
  <a href="https://colby.dauphina.is">Colby Dauphinais</a>
</p>
