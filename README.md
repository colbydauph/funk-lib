# funk-lib

Functional JavaScript Library

[![CircleCI](https://circleci.com/gh/colbydauph/funk-lib/tree/master.svg?style=svg)](https://circleci.com/gh/colbydauph/funk-lib/tree/master)
[![npm module](https://badge.fury.io/js/funk-lib.svg)](https://www.npmjs.org/package/funk-lib)


## Install
```shell
$ npm i -P colbydauph/funk-lib
# or: es-module compatible build
$ npm i -P colbydauph/funk-lib-es
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
| `lint`       | Lint the source |
| `test`       | Run tests |
| `test:watch` | Run tests on change |
| `verify`     | Verify linting, tests, coverage |