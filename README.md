# legit

legit is a command line application that allows you to automagically generate a
LICENSE file for the current working directory that you are in.

### Installation

```
npm install --global @captainsafia/legit
```

### Usage

```
  Usage: legit [options] [placeholders]

  Options:

    -h, --help               output usage information
    -V, --version            output the version number
    -a, --list-all           List installed licenses
    -l, --license            The license to include, as an SPDX License Identifier (mandatory)

  Placeholders:
    <key>=<value>
```

### Example
```
mkdir /tmp/test ; cd $_
legit -l Apache-2.0 year=2001 user=maoo name=legit package-home-page=https://github.com/maoo/legit
```

If not `year` is the defined, the current one is used.

Placeholder keys are resolved against [license-placeholders.yml](license-placeholders.yml) definition, depending on the license in use.

If no placeholders configuration is available for the requested license, legit will prepend the following license header:
```
Copyright (c) [year] [user]


```

### Supported Licenses

legit uses SPDX license IDs and definitions as a backend, therefore all [SPDX licenses](https://spdx.org/licenses/) are supported.

[license-placeholders.yml](license-placeholders.yml) defines placeholder mappings for the following licenses:

- [AGPL-3.0](https://spdx.org/licenses/AGPL-3.0.html)
- [Apache-2.0](https://spdx.org/licenses/Apache-2.0.html)
- [BSD-2-Clause](https://spdx.org/licenses/BSD-2-Clause.html)
- [ISC](https://spdx.org/licenses/ISC.html)
- [MIT](https://spdx.org/licenses/MIT.html)
- [MPL-2.0](https://spdx.org/licenses/MPL-2.0.html)
- [Unlicense](https://spdx.org/licenses/Unlicense.html)

### Known issues

- placeholders including `'` character don't work
- Regexp support for license placeholders
- Integrate with [SPDX Templatizing efforts](https://wiki.spdx.org/view/Legal_Team/Templatizing)
