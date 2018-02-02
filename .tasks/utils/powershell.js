'use strict';
var exec = require('child_process').exec,
    format = require('string-format'),
    configuration = require("../@configuration.js");

var exports = module.exports = {};

exports.execute = (filePath, args, done) => {
    exec(format("Powershell.exe  -executionpolicy remotesigned -File {0}\\{1} {2}", configuration.PATHS.SCRIPTS, filePath, args), done);
}