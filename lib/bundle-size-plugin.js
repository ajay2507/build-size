const lasso = require('lasso');
const fs = require('fs');
const path = require('path');
const prettyCli = require('prettycli');
const gzip = require('gzip-size');
const brotli = require('brotli-size');
const bytes = require('bytes');


module.exports = (lasso, config) => {
    lasso.on('beforeBuildPage', (event) => {
        const context = event.context;
        const packageConfig = readPackageJson();
        prettyCli.info("Bundle-size-plugin", `Environment - ${process.env.NODE_ENV}`);
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

// Check both JS and CSS size.
const checkSize = (bundlePath, config, type) => {
    let isFileSizeValid = false;
    if (!config.minify) {
        config.minify = "";
    }
    const fileSize = calculateSize(bundlePath, config.minify);
    if (config[type] && (fileSize > bytes(config[type].maxAssetSize))) {
        prettyCli.error(`${type.toUpperCase()} size is exceeded \n Expected ${type} Size :${config[type].maxAssetSize} \n Actual ${type} Size : ${bytes(fileSize)}`);
    } else {
        prettyCli.info('PASSED', `${type.toUpperCase()} Size is Passed`);
    }
    return null;
};

// calculate size based on the minify flag.
const calculateSize = (bundlePath, minify) => {
    if (minify.toLowerCase() === "gzip") {
        return gzip.sync(fs.readFileSync(bundlePath));
    } else if (minify.toLowerCase() === "brotli") {
        return brotli.sync(fs.readFileSync(bundlePath));
    } else {
        return Buffer.byteLength(fs.readFileSync(bundlePath));
    }
}

// Default Size.
const defaultSize = {
    'minify': 'gzip',
    'js': {
        maxAssetSize: '150 kb'
    },
    'css': {
        maxAssetSize: '50 kb'
    }
}

module.exports = { readPackageJson, checkSize, calculateSize }
