# deified
Fast, lightweight asynchronous director scanner built on micromatch

```js
const deified = require('deified')
const config = { //optional - all configuration has intuitive defaults
  glob: {
    globs: ['**/*.js'], //passed to micromatch - defaults to [**/*]
    options: {}, //options for micromatch - defaults to undefied
  },
  filter: {
    regexes: ['/?test/'] //defaults to filter hidden files and node_modules
  },
  scan: {
    options: { encoding: 'utf8' } //options for readdir - defaults to undefined
  }
};

const deify = deified.configure(config);
const paths = await deify({ directory: __dirname }); //pass the directory to scan - defaults to cwd
```

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 7.7 or higher is required.

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install deified
```

## Features

  * Based on the fast micromatch
  * Filters apply during directory scanning to eliminate unnessesary IO
  * Globs apply after scanning to fine tune results
  * IO uses asynchronous filesystem calls

## Tests

  To run the test suite, first install the dependencies, then run `npm test`:

```bash
$ npm install
$ npm test
```

## People

The original author of Express is [Phillip Smith](https://github.com/phillipsmith)

The current lead maintainer is [Phillip Smith](https://github.com/phillipsmith)

[List of all contributors](https://github.com/CoderByBlood/deified/graphs/contributors)

## License

  [MIT](LICENSE)