#! /usr/bin/env node

var fs = require('fs');
var program = require('commander');
var spdxLicenses = require('spdx-licenses');
var spdxLicenseIds = require('spdx-license-ids');
var request = require('sync-request');
var yaml = require('node-yaml');
var replaceAll = require("replaceall");

// Easily switch on/off debugging statements
var isDebugMode = false;
console.debug = function(args) {
  if (isDebugMode) {
    console.log(args);
  }
}

function validateLicense(license) {
  spdxLicense = spdxLicenses.spdx(license);
  if (spdxLicense) {
    console.debug('Found SPDX License: ' + spdxLicense.id + ' (' + spdxLicense.name + ')');
  } else {
    console.error('Unknown SPDX license identifier ' + license + '; please refer to https://spdx.org/licenses');
    process.exit(1);
  }
  return spdxLicense.id;
}

program
  .version('1.0.0')
  .usage('[options]')
  .option('-a, --list-all', 'List all SPDX license identifiers')
  .option('-l, --license <license>', 'The license to include, as an SPDX license identifier (mandatory)', validateLicense)
  .option('-u, --user <user>', 'The individual who owns the IP (mandatory)')
  .option('-y, --year <year>', 'The year the license is effective (optional, defaults to this year)')
  .option('-n, --name <name>', 'A short name of the package (mandatory)')
  .option('-w, --webpage <URL>', 'The URL of the home of the package e.g. on GitHub (optional, defaults to NONE)')
  .parse(process.argv);

if (program.license && program.user && program.name) {
  const cwd = process.cwd();

  // Populate defaults, if needed
  program.year    = program.year    || (new Date().getFullYear()).toString();
  program.webpage = program.webpage || "NONE";  // See https://spdx.org/spdx-specification-21-web-version#h.3o7alnk

  // Fetch license text from official SPDX license list on GitHub
  var licenseUrl = 'https://raw.githubusercontent.com/spdx/license-list/master/' + program.license + '.txt';
  var licenseText = request('GET', licenseUrl).getBody().toString('utf8');

  // Write LICENSE file
  fs.readFile(__dirname + '/license-placeholders.yml', 'utf8', function (error, data) {
    if (error) {
      console.log(error);
      process.exit(1);
    } else {
      // Replace placeholders them in the license text
      console.debug('license placeholders raw:\n' + data);
      var licensePlaceholders = yaml.parse(data);

      var parsedLicenseText = licenseText;

      placeholders = licensePlaceholders[program.license];

      // Define default license header
      if (!placeholders) {
        parsedLicenseText = "Copyright (c) [year] [user]\n\n"+parsedLicenseText;
        placeholders = [{
          "user": '[user]',
          "year": '[year]'
        }]
      }

      placeholders.forEach(function(placeholder) {
        Object.keys(placeholder).forEach(function(placeholderKey) {
          var placeholderOldValue = placeholder[placeholderKey];
          var placeholderNewValue = program[placeholderKey];
          console.debug('Replacing ' + placeholderOldValue + ' with ' + placeholderNewValue + ' in LICENSE text');

          parsedLicenseText = replaceAll(placeholderOldValue, placeholderNewValue, parsedLicenseText);
        });
      });

      // Write content
      fs.writeFile(cwd + '/LICENSE', parsedLicenseText, 'utf8', function (error) {
        if (error) {
          console.error(error);
          process.exit(1);
        }})}});

  // Write LICENSE.spdx file
  fs.readFile(__dirname + "/LICENSE.spdx.template", 'utf8', function (error, data) {
    if (error) {
      console.log(error);
      process.exit(1);
    } else {
      var spdxLicenseText = data;
      spdxLicenseText = replaceAll('[user]',                    program.user,    spdxLicenseText);
      spdxLicenseText = replaceAll('[name]',                    program.name,    spdxLicenseText);
      spdxLicenseText = replaceAll('[package-home-page]',       program.webpage, spdxLicenseText);
      spdxLicenseText = replaceAll('[spdx-license-identifier]', program.license, spdxLicenseText);
      fs.writeFile(cwd + '/LICENSE.spdx', spdxLicenseText, 'utf8', function (error) {
        if (error) {
          console.error(error);
          process.exit(1);
        }});
    }});
} else if (program.listAll) {
  spdxLicenseIds.sort().forEach(function(spdxLicenseId) {
    console.log(spdxLicenseId);
  });
} else {
  program.help();
}
