#! /usr/bin/env node

var fs = require('fs');
var program = require('commander');
var spdxLicenses = require('spdx-licenses');
var htmlToText = require('html-to-text');
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
    console.debug('Found SPDX License');
    console.debug('id : ' + spdxLicense.id);
    console.debug('name : ' + spdxLicense.name);
  } else {
    console.error("Couldn't resolve license on SPDX; please refer to https://spdx.org/licenses");
    process.exit(1);
  }
  return spdxLicense.id;
}

console.debug("Starting...");

program
  .version('1.0.0')
  .usage('[options]')
  .option('-a, --list-all', 'List all SPDX License Identifiers')
  .option('-l, --license <license>', 'The license to include, as an SPDX License Identifier (mandatory)', validateLicense)
  .option('-u, --user <user>', 'The individual who owns the IP (mandatory)')
  .option('-y, --year <year>', 'The year the license is effective (optional, defaults to this year)')
  .option('-n, --name <name>', 'A short name of the package (mandatory)')
  .option('-w, --webpage <URL>', 'The URL of the home of the package e.g. on GitHub (optional, defaults to NONE)')
  .parse(process.argv);


if (program.license && program.user && program.name) {
  const cwd   = process.cwd();
  program.year    = program.year    || (new Date().getFullYear()).toString();
  program.webpage = program.webpage || "NONE";  // See https://spdx.org/spdx-specification-21-web-version#h.3o7alnk

  var licenseUrl = 'https://spdx.org/licenses/' + program.license + '.html';

  // Fetch license text from SPDX license list (in HTML format)
  var res = request('GET', licenseUrl);
  var licenseHtml = res.getBody();

  // Convert the content of the <div class="license-text"> tag to text, and drop the rest
  var licenseText = htmlToText.fromString(licenseHtml, {
    baseElement: 'div.license-text'
  });
  console.debug('Parsed license text from HTML:\n' + licenseText);

  // Write LICENSE
  fs.readFile(__dirname + "/license-placeholders.yml", 'utf8', function (error, data) {
    if (error) {
      console.log(error);
      process.exit(1);
    } else {
      console.debug("license placeholders raw:\n" + data);
      var licensePlaceholders = yaml.parse(data);
      console.debug("license placeholders:\n" + licensePlaceholders);

      // Replace placeholders
      var parsedLicenseText = licenseText;
      placeholders = licensePlaceholders[program.license];
      if (placeholders) {
        placeholders.forEach(function(placeholder) {
          Object.keys(placeholder).forEach(function(placeholderKey) {
            var placeholderOldValue = placeholder[placeholderKey];
            var placeholderNewValue = program[placeholderKey];
            console.debug("placeholder:");
            console.debug("key: " + placeholderKey);
            console.debug("old value: " + placeholderOldValue);
            console.debug("new value: " + placeholderNewValue);

            parsedLicenseText = replaceAll(placeholderOldValue, placeholderNewValue, parsedLicenseText);
          });
        });
      }

      fs.writeFile(cwd + '/LICENSE', parsedLicenseText, 'utf8', function (error) {
        if (error) {
          console.error(error);
          process.exit(1);
        }})}});

  // Write LICENSE.spdx
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
  /* TODO: spdx-licenses currently doesn't provide a way to list all known licenses */
  console.log("Not yet implemented, sorry.  Please see https://spdx.org/licenses/ instead.");
} else {
  program.help();
}
