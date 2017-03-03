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

Additionally, it allows to replace placeholders in the license text with command-line options; placeholders are defined by [license-placeholders.yml](license-placeholders.yml):

- [AGPL-3.0](https://spdx.org/licenses/AGPL-3.0.html)
- [Apache-2.0](https://spdx.org/licenses/Apache-2.0.html)
- [BSD-2-Clause](https://spdx.org/licenses/BSD-2-Clause.html)
- [ISC](https://spdx.org/licenses/ISC.html)
- [MIT](https://spdx.org/licenses/MIT.html)
- [MPL-2.0](https://spdx.org/licenses/MPL-2.0.html)
- [Unlicense](https://spdx.org/licenses/Unlicense.html)

If no placeholders are available, legit will prepend the following license header:
```
Copyright (c) [year] [user]


```

### Known issues

- placeholder list is hardcoded (`user`,`year`,`name`), should be parametric
- add more items in [license-placeholders.yml](license-placeholders.yml)
- placeholders including `'` character don't work
- Regexp support for license placeholders
