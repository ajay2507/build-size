#!/usr/bin / env node
'use strict';

const fs = require('fs')
const parseArgs = require('minimist');
const { createBundle } = require('bundle-me');
const { readPackageJson, checkSize } = require('./bundle-size-plugin');
const argv = parseArgs(process.argv.slice(2));
const input = argv._ || [];
const JS_BUNDLE_NAME = "bundle.js";
const CSS_BUNDLE_NAME = "bundle.css";
let path = 'static';
let minify = argv.minify || '';

const packageConfig = readPackageJson();
if (!packageConfig['bundle-size-plugin']) throw new Error('It looks like you didn\'t mention config in package.json . \n you should mention it in bundle-size-plugin in package.json');
packageConfig['bundle-size-plugin'].minify = minify;
if (input.length > 0) {
    path = input[0];
}

bundleFiles().then(() => {
    // check JS size
    checkJSSize();
    // check CSS size
    checkCSSSize();
});

const checkJSSize = () => {
    if (fs.existsSync(JS_BUNDLE_NAME)) {
        try {
            checkSize(JS_BUNDLE_NAME, packageConfig['bundle-size-plugin'], 'js');
            fs.unlinkSync(JS_BUNDLE_NAME);
        } catch (error) {
            // delete file 
            fs.unlinkSync(JS_BUNDLE_NAME);
        }
    }
}

const checkCSSSize = () => {
    if (fs.existsSync(CSS_BUNDLE_NAME)) {
        try {
            checkSize(CSS_BUNDLE_NAME, packageConfig['bundle-size-plugin'], 'css');
            fs.unlinkSync(CSS_BUNDLE_NAME);
        } catch (error) {
            // delete file 
            fs.unlinkSync(CSS_BUNDLE_NAME);
        }
    }
}

//const timeout = ms => new Promise(res => setTimeout(res, ms));
async function bundleFiles() {
    const extension = ['js', 'css'];
    await extension.map((extn) => {
        createBundle({ path, extn, outputPath: `bundle.${extn}` });
    });
};
