const lasso = require('lasso');
const fs = require('fs');
const path = require('path');
const prettyCli = require('prettycli');
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
                checkSize(bundlePath, bundleSizeConfig.js);
            } else if (bundle.contentType === "css" && bundlePath) {
                if (!bundleSizeConfig.js) {
                    throw new Error("css size is not specified correctly refer doc");
                }
                checkSize(bundlePath, bundleSizeConfig.css);
            }
        });
    });
};

const readPackageJson = () => {
    return JSON.parse(fs.readFileSync(path.resolve(process.cwd(), '/package.json'), 'utf8'));
}

const checkSize = (bundlePath, config) => {
    if (!config.minify) {
        config.minify = "";
    }
    const bundleSize = calculateSize(bundlePath, config.minify);

};

const calculateSize = () => {
    if () {

    } else if () {

    } else {

    }
}

const defaultSize = {
    'minify': 'gzip',
    'js': {
        maxSize: '120 kb'
    },
    'css': {
        maxSize: '10 kb'
    }
}

console.log(readPackageJson());

