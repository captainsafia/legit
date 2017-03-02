# legit

legit is a command line application that allows you to automagically generate a
LICENSE file for the current working directory that you are in.

### Installation

```
npm install --global @captainsafia/legit
```

### Usage

```
  Usage: legit [options]

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -a, --list-all           List installed licenses
    -l, --license <license>  The license to include
    -u, --user <user>        The individual who owns the license
    -y, --year <year>        The year the license is effective

```

![Legit Demo](legit-demo.gif)

### Available Licenses

legit currently supports a limited subset of licenses, listed below. In order
to add a license, submit a pull request that contains a template of the license
inside the `licenses` directory with the strings `[user]` and `[year]` used to
denote where thoe parameters should be inserted.

#### Currently Supported Licenses
- MIT (mit)
- Mozilla Public License 2.0 (mpl2)
- Apache License 2.0 (apache2)
- GNU Affero General Public License 3.0 (agpl3)
- ISC License (isc)
