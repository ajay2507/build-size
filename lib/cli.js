#!/usr/bin / env node
'use strict';

const fs = require('fs')
const parseArgs = require('minimist');
const { createBundle } = require('bundle-me');
const { readPackageJson, checkSize } = require('./bundle-size-plugin');
const argv = parseArgs(process.argv.slice(2));
const input = argv._ || [];
let path = 'static';
let minify = '';

const packageConfig = readPackageJson();
console.log(packageConfig.bundle);
if (!packageConfig.bundle) throw new Error('\n\n\n*******\n\nIt looks like you tried to install all-contributors into your project. ' +
    'This module is simply a specification and doesn\'t actually do anything.\nIf you meant to install the CLI, please ' +
    'uninstall this module first (npm uninstall all-contributors) and install `all-contributors-cli`.\n\n*******\n\n\n\n');
if (input.length > 0) {

}

bundleFiles().then(() => {
    checkJSSize();
    checkCSSSize();
});

const checkJSSize = () => {

}

const checkCSSSize = () => {

}
console.log(input);


//const timeout = ms => new Promise(res => setTimeout(res, ms));
async function bundleFiles() {
    const extension = ['js', 'css'];
    await extension.map((extn) => {
        createBundle({ path, extn, outputPath: `lasso-analyze.${extn}` });
    });
    // await timeout(5501);
}

const delay = ms => new promise(res => setTimeout(res, ms));

console.log(argv);