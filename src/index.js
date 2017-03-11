#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const program = require('commander');
const username = require('username');
const placeholders = require('./placeholders');
const commentator = require('@captainsafia/commentator');

const licensesPath = path.join(__dirname, '/../licenses/');

function validateLicense(license) {
  license = license.toLowerCase();
  const licenses = fs.readdirSync(licensesPath);
  return licenses.indexOf(license) > -1;
}

program
  .version('2.0.0');

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
  .command('put <license>').alias('p')
  .option('-f --file [file]', 'The file to add a header to')
  .option('-u --user [user]', 'The user/organization who holds the license')
  .option('-y --year [year]', 'The year the license is in effect')
  .description('Put a license in this directory')
  .action(function(licenseArg) {
    const fileArg = this.file;
    const yearArg = this.year || new Date().getFullYear();
    const userArg = this.user || username.sync();

    const user = placeholders[licenseArg]['user'];
    const year = placeholders[licenseArg]['year'];

    const cwd = process.cwd();

    if (!validateLicense(licenseArg)) {
      return console.log('Please choose one of the licenses under `legit list`!');
    }

    if (fileArg) {
      const headerFile = path.join(__dirname, '/../licenses/headers/', licenseArg);
      const fileExtension = fileArg.split('.').pop();
      if (!fs.existsSync(headerFile)) {
        console.log('Header not available for', licenseArg, 'license');
      }

      fs.readFile(headerFile, 'utf8', function(error, data) {
        if (error) console.log(error);

        try {
          var result = commentator.makeBlockComment(
            data.replace(user, userArg).replace(year, yearArg), fileExtension);
        } catch (error) {
          if (error.message.includes('Block comment')) {
            try {
            var result = commentator.makeInlineComment(
              data.replace(user, userArg).replace(year, yearArg), fileExtension);
            } catch(error) {
              if (error.message.includes('Inline comment')) {
                return console.log('@captainsafia/commentator doesn\'t support block comments',
                  'for files with this extension, please open an issue at https://github.com/captainsafia/commentator/issues',
                  'to add support for this programming language.');
              }
            }
          }
        }

        const filePath = path.join(cwd, '/', fileArg);

        fs.readFile(filePath, 'utf8', function(error, data) {
          const newData = result + '\n' + data;
          fs.writeFile(filePath, newData, 'utf8', function(error) {
            if (error) console.log(error);
          });
        });
      });
    } else {
      const licenseFile = licensesPath + licenseArg;
      fs.readFile(licenseFile, 'utf8', function (error, data) {
        if (error) console.log(error);
        if (placeholders[licenseArg]) {
          var result = data.replace(user, userArg).replace(year, yearArg);
        }
        fs.writeFile(path.join(cwd, '/LICENSE'), result || data, 'utf8', function (error) {
          if (error) return console.log(error);
        });
      });
    }
  });

program.parse(process.argv);
