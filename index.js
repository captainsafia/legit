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
  .parse(process.argv);

console.log(program.args);

if (program.license) {
  const cwd = process.cwd();

  //Create a placeholders hash
  var placeholders = {}
  program.args.forEach(function(placeholder) {
    keyValue = placeholder.split("=");
    placeholders[keyValue[0]] = keyValue[1];
  });

  // Populate defaults, if needed
  placeholders['spdx-license-identifier'] = program.license;
  placeholders['year']    = placeholders['year']    || (new Date().getFullYear()).toString();
  placeholders['webpage'] = placeholders['webpage'] || "NONE";  // See https://spdx.org/spdx-specification-21-web-version#h.3o7alnk

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

      placeholderTokens = licensePlaceholders[program.license];

      // Define default license header
      if (!placeholderTokens) {
        parsedLicenseText = "Copyright (c) [year] [user]\n\n"+parsedLicenseText;
        placeholderTokens = [{
          "user": '[user]',
          "year": '[year]'
        }]
      }

      placeholderTokens.forEach(function(placeholderItem) {
        Object.keys(placeholderItem).forEach(function(placeholderKey) {
          var placeholderToken = placeholderItem[placeholderKey];
          var placeholderValue = placeholders[placeholderKey];
          console.debug('Replacing ' + placeholderToken + ' with ' + placeholderValue + ' in LICENSE text');
          if (placeholderValue && parsedLicenseText.indexOf(placeholderToken) > -1) {
            parsedLicenseText = replaceAll(placeholderToken, placeholderValue, parsedLicenseText);
          } else {
            console.log("WARNING! Couldn't read placeholder '"+ placeholderToken +"' from command-line params");
          }
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
      Object.keys(placeholders).forEach(function(placeholderKey) {
        var placeholderValue = placeholders[placeholderKey];
        var placeholderToken = '['+placeholderKey+']';
        if (placeholderValue && spdxLicenseText.indexOf(placeholderToken) > -1) {
          spdxLicenseText = replaceAll(placeholderToken, placeholderValue, spdxLicenseText);
        } else {
          console.log("WARNING! Couldn't read placeholder '"+ placeholderKey +"' from command-line params");
        }
      });

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
