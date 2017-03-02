#! /usr/bin/env node

// TODO - make it configurable
var licensePlaceholdersUrl = "https://raw.githubusercontent.com/maoo/legit/spdx-backend/license-placeholders.yml";

var fs = require('fs');
var program = require('commander');
var spdxLicenses = require('spdx-licenses');
var htmlToText = require('html-to-text');
var request = require('sync-request');
var yaml = require('node-yaml');

// Easily switch on/off debugging statements
var isDebugMode = false;
console.debug = function(args) {
  if (isDebugMode){
    console.log(args);
  }
}

// Load license placeholders
var phRes = request('GET', licensePlaceholdersUrl);
var licensePlaceholdersRaw = phRes.getBody();

console.debug("license placeholders raw: "+licensePlaceholdersRaw);
var licensePlaceholders = yaml.parse(licensePlaceholdersRaw);
console.debug("license placeholders: "+licensePlaceholders);

function validateLicense(license) {
  spdxLicense = spdxLicenses.spdx(license);
  if (spdxLicense) {
    console.log('Found SPDX License');
    console.log('id : '+spdxLicense.id);
    console.log('name : '+spdxLicense.name);
  } else {
    console.error("Couldn't resolve license on SPDX; please refer to https://spdx.org/licenses");
    process.exit(1);
  }
  return spdxLicense.id;
}

program
  .version('1.0.0')
  .usage('[options]')
  .option('-l, --license <license>', 'The license to include', validateLicense)
  .option('-u, --user <user>', 'The individual who owns the license')
  .option('-y, --year <year>', 'The year the license is effective')
  .option('-d, --oneline <oneline>', 'One line to give the program name and a brief idea of what it does')
  .parse(process.argv);


if (program.license) {
  const cwd = process.cwd();
  var year = program.year || new Date().getFullYear();
  var licenseUrl = 'https://spdx.org/licenses/'+program.license + '.html';

  // Fetch SPDX html page
  var res = request('GET', licenseUrl);
  var licenseHtml = res.getBody();
  //console.debug('Resolved SPDX license URL ' + licenseUrl);
  //console.debug('Fetched license HTML ' + licenseHtml);

  // Only take <div class="license-text"> element, skip the rest
  var licenseText = htmlToText.fromString(licenseHtml, {
    baseElement: 'div.license-text'
  });
  //console.debug('Parsed license text from HTML' + licenseText);

  // Replace placeholders
  parsedLicenseText = licenseText;
  placeholders = licensePlaceholders[program.license];
  if (placeholders) {
    placeholders.forEach(function(placeholder){
      Object.keys(placeholder).forEach(function(placeholderKey) {
        var placeholderOldValue = placeholder[placeholderKey];
        var placeholderNewValue = program[placeholderKey];
        console.debug("placeholder:");
        console.debug("key: " + placeholderKey);
        console.debug("old value: " + placeholderOldValue);
        console.debug("new value: " + placeholderNewValue);

        parsedLicenseText = parsedLicenseText.replace(placeholderOldValue, placeholderNewValue);
      });
    });
  }

  // Write license to file
  fs.writeFile(cwd + '/LICENSE', parsedLicenseText, 'utf8', function (error) {
    if (error) return console.error(error);
  });
} else {
  program.help();
}
