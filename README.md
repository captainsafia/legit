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
    -l, --license            The license to include, as an SPDX License Identifier (mandatory)
    -u, --user <user>        The individual who owns the IP (mandatory)
    -y, --year <year>        The year the license is effective (optional, defaults to this year)
    -n, --name <name>        A short name for the package (mandatory)
    -w, --webpage <URL>      The URL of the home of the package e.g. on GitHub (optional, defaults to NONE)

```

![Legit Demo](legit-demo.gif)

### Available Licenses

legit uses SPDX license IDs and definitions as a backend, therefore all [SPDX licenses](https://spdx.org/licenses/) are supported.

Additionally, it allows to replace placeholders in the license text with command-line options; placeholders are defined by [license-placeholders.yml](license-placeholders.yml).

### Known issues

- placeholder list is hardcoded (`user`,`year`,`name`), should be parametric
- add more items in [license-placeholders.yml](license-placeholders.yml)
- placeholders including `'` character don't work
- Regexp support for license placeholders
