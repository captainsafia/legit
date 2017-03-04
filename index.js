#! /usr/bin/env node

const fs = require('fs');
const program = require('commander');
const username = require('username');
const placeholders = require('./placeholders');
const firstCommitDate = require('first-commit-date');

const licensesPath = __dirname + '/licenses/';

function validateLicense(license) {
  license = license.toLowerCase();
  const licenses = fs.readdirSync(licensesPath);
  return licenses.indexOf(license) > -1;
}

program
  .version('2.0.0')

program
  .command('list').alias('l')
  .description('List all available licenses')
  .action(function() {
    fs.readdir(licensesPath, function (error, items) {
      if (error) console.log(error);
      items.forEach(function(item) { console.log(item); });
    })
  });

program
  .command('put <license> [user] [year]').alias('p')
  .description('Put a license in this directory')
  .action(function(licenseArg, userArg, yearArg) {
    if (!validateLicense(licenseArg)) {
      return console.log('Please choose one of the licenses under `legit list`!');
    }

    const cwd = process.cwd();
    const licenseFile = licensesPath + licenseArg;
    fs.readFile(licenseFile, 'utf8', function (error, data) {
      if (error) console.log(error);
      if (yearArg === "auto") {
        var firstCommitYear = firstCommitDate.sync(cwd + '/.git').getFullYear();
        var currentYear = new Date().getFullYear();
        if (currentYear === firstCommitYear) {
          yearArg = currentYear;
        } else {
          yearArg = firstCommitYear + "-" + currentYear;
        }
      } else {
        yearArg = yearArg || new Date().getFullYear();
      }
      userArg = userArg || username.sync();
      if (placeholders[licenseArg]) {
        const user = placeholders[licenseArg]['user'];
        const year = placeholders[licenseArg]['year'];
        var result = data.replace(user, userArg).replace(year, yearArg);
      }
      fs.writeFile(cwd + '/LICENSE', result || data, 'utf8', function (error) {
        if (error) return console.log(error);
      });
    });
  });

program.parse(process.argv);
