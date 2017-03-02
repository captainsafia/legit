#! /usr/bin/env node

var fs = require('fs');
var program = require('commander');
const licensesPath = __dirname + '/licenses/';

function validateLicense(license) {
  license = license.toLowerCase();
  const licenses = fs.readdirSync(licensesPath);
  if (licenses.indexOf(license) > -1) {
    return license;
  } else {
    return 'mit';
  }
}

program
  .version('1.0.0')
  .usage('[options]')
  .option('-l, --license <license>', 'The license to include', validateLicense)
  .option('-u, --user <user>', 'The individual who owns the license')
  .option('-y, --year <year>', 'The year the license is effective')
  .parse(process.argv);


if (program.license) {
  const cwd = process.cwd();
  const licenseFile = licensesPath + program.license;
  fs.readFile(licenseFile, 'utf8', function (error, data) {
    if (error) console.log(error);
    if (program.user && program.year) {
      var result = data.replace('[user]', program.user).replace('[year]', program.year);
      fs.writeFile(cwd + '/LICENSE', result, 'utf8', function (error) {
        if (error) return console.log(error);
      });
    } else {
      program.help();
    }
  });
} else {
  program.help();
}
