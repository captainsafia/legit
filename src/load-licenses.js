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

fetch(`${ENDPOINT}/licenses`, options)
  .then(response => response.json(), error => console.log(error))
  .then(licenses => {
    licenses.forEach(license => {
      fetch(`${ENDPOINT}/licenses/${license.key}`, options)
        .then(response => response.json(), error => console.log(error))
        .then(license => {
          fs.writeFile(path.join(__dirname, '/../licenses/', license.key), license.body, error => {
            if (error) {
              console.log(error);
            }
          });
        });
    });
  });
