const lasso = require('lasso');
const fs = require('fs');
const path = require('path');
const prettyCli = require('prettycli');
const gzip = require('gzip-size');
const brotli = require('brotli-size');
const bytes = require('bytes');
const packageConfig = {};

module.exports = (lasso, config) => {
    lasso.on('beforeBuildPage', (event) => {
        const context = event.context;
        packageConfig = readPackageJson();
        prettyCli.info(`Bundle-size-plugin Environment ${process.env.NODE_ENV}`);
        context.on('bundleWritten', (event) => {
            const bundle = event.bundle;
            const bundlePath = bundle.outputFile;
            const bundleSizeConfig = packageConfig.bundle || defaultSize;
            if (bundle.contentType === "js" && bundlePath) {
                if (!bundleSizeConfig.js) {
                    throw new Error("js size is not specified correctly refer doc");
                }
                return checkSize(bundlePath, bundleSizeConfig, 'js');
            } else if (bundle.contentType === "css" && bundlePath) {
                if (!bundleSizeConfig.js) {
                    throw new Error("css size is not specified correctly refer doc");
                }
                return checkSize(bundlePath, bundleSizeConfig, 'css');
            }
        });
    });
};

const readPackageJson = () => {
    return JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8'));
}

const isSizeValid = (bundlePath, config, type) => {
    let isFileSizeValid = false;
    if (!config.minify) {
        config.minify = "";
    }
    const fileSize = calculateSize(bundlePath, config.minify);
    if (config[type] && bytes(config[type].maxSize) > fileSize) {
        prettyCli.error(`${type} Size is exceeded \n Expected ${type} Size :${config[type].maxSize} \n 
        Actual ${type} Size : ${bytes(fileSize)}`);
    }
    return null;
};

const calculateSize = (bundlePath, minify) => {
    if (minify.toLowerCase() === "gzip") {
        return gzip.sync(fs.readFileSync(bundlePath));
    } else if (minify.toLowerCase() === "brotli") {
        return brotli.sync(fs.readFileSync(bundlePath));
    } else {
        return Buffer.byteLength(fs.readFileSync(bundlePath));
    }
}


//console.log(readPackageJson());
const defaultSize = {
    'minify': false,
    'js': {
        maxSize: '12 kb'
    },
    'css': {
        maxSize: '10 kb'
    }
}

console.log(checkSize(path.resolve(process.cwd(), 'package.json'), defaultSize, 'js'));

//console.log(readPackageJson());

