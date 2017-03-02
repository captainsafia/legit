#! /usr/bin/env node

var fs = require('fs');
var path = require('path');
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
  .option('-a, --list-all', 'List installed licenses')
  .option('-l, --license <license>', 'The license to include', validateLicense)
  .option('-u, --user <user>', 'The individual who owns the license')
  .option('-y, --year <year>', 'The year the license is effective')
  .parse(process.argv);

var license = program.license;
var user = program.user;

if (!license || !user) {
  try {
    const packageJson = require(path.join(process.cwd(), 'package.json'));
    if (!license && packageJson.license) license = packageJson.license;
    
    if (!user && packageJson.author) {
      if (typeof packageJson.author === 'string') {
        user = packageJson.author.replace(/<.+>/, '').replace(/\(.+\)/, '').trim();
      } else if (typeof packageJson.author === 'object' && packageJson.author.name) {
        user = packageJson.author.name;
      }
    }
  } catch (e) {
    // Couldn't find package.json in current directory, nothing to do
  }
}

if (license) {
  const cwd = process.cwd();
  const licenseFile = licensesPath + license;
  fs.readFile(licenseFile, 'utf8', function (error, data) {
    if (error) console.log(error);
    if (user && program.year) {
      var result = data.replace('[user]', user).replace('[year]', program.year);
      fs.writeFile(cwd + '/LICENSE', result, 'utf8', function (error) {
        if (error) return console.log(error);
      });
    } else {
      program.help();
    }
  });
} else if (program.listAll) {
    fs.readdir(__dirname + '/licenses/', function(err, items) {
        for (var i=0; i<items.length; i++) {
            console.log(items[i].slice(0, -4));
        }
    })
} else {
  program.help();
}
