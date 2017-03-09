'use strict';

const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const ENDPOINT = 'https://api.github.com';
const options = {
  headers: {
    'Accept': 'application/vnd.github.drax-preview+json'
  }
};

fetch(ENDPOINT + '/licenses', options)
  .then(function(response) {
    return response.json();
  }, function(error) {
    return console.log(error);
  })
  .then(function(licenses) {
    licenses.forEach(function(license) {
      fetch(ENDPOINT + '/licenses/' + license.key, options)
        .then(function(response) {
          return response.json();
        }, function(error) {
          return console.log(error);
        })
        .then(function(license) {
          fs.writeFile(path.join(__dirname, '/../licenses/', license.key), license.body, function(error) {
            if (error) {
              console.log(error);
            }
          });
        });
    });
  });
