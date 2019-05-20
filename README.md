# legit

legit is a command line application that allows you to automagically generate a
LICENSE file for the current working directory that you are in or a license header
for a file where applicable.

### Installation

```
npm install --global @captainsafia/legit
```

### Usage

```
  Usage: legit [options] [command]


  Commands:

    list|l                     List all available licenses
    put|p [options] <license>  Put a license in this directory

  Options:

    -h, --help     output usage information
    -V, --version  output the version number

  Usage: put|p [options] <license>

  Put a license in this directory

  Options:

    -h, --help        output usage information
    -f --file <file>  The file to add a header to
    -u --user [user]  The user/organization who holds the license
    -y --year [year]  The year the license is in effect
```

![Legit Demo](https://cloud.githubusercontent.com/assets/1857993/23821404/bea5dfc2-05f6-11e7-8525-7f5bd88a7829.gif)

### Currently Supported Licenses
- BSD 2-clause Simplified License (bsd-2-clause)
- GNU General Public License v2.0 (gpl-2.0)
- BSD 3-clause New or Revised License (bsd-3-clause)
- The Unlicense (unlicense)
- GNU Lesser General Public License v2.1 (lgpl-2.0)
- GNU General Public License v3.0 (gpl-3.0)
- MIT License (mit)
- GNU Affero General Public License v3.0 (agpl-3.0)
- Eclipse Public License 1.0 (epl-1.0)
- Apache License 2.0 (apache-2.0)
- Mozilla Public License 2.0 (mpl-2.0)
- GNU Lesser General Public License v3.0 (lgpl-3.0)
- ISC License (ics)
