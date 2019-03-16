const lasso = require('lasso');
const fs = require('fs');
const path = require('path');
const prettyCli = require('prettycli');
const isDevelopment =
    !process.env.NODE_ENV ||
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === 'dev';

module.exports = (lasso, config) => {
    lasso.on('beforeBuildPage', (event) => {
        const context = event.context;
        context.on('bundleWritten', (event) => {

        });
    });
};

