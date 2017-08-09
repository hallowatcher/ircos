# ircos
[![Travis](https://img.shields.io/travis/hallowatcher/ircos.svg)](https://travis-ci.org/hallowatcher/ircos)
[![Codecov](https://img.shields.io/codecov/c/github/hallowatcher/ircos.svg)](https://codecov.io/gh/hallowatcher/ircos)
[![David](https://img.shields.io/david/hallowatcher/ircos.svg)]()
[![license](https://img.shields.io/github/license/hallowatcher/ircos.svg)](LICENSE)

An IRC client built and refined for osu!

## About

Have you ever felt the need to talk to your buddies in osu! without having to open the game? This client does just that, and also makes sure you have the best user experience possible.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Things you need

```
nodejs
```

### Installing

A step by step series of examples that tell you have to get a development copy running

Clone this repository

```
git clone https://github.com/Hallowatcher/ircos.git
```

Install dependencies

`npm install` or `yarn`

Pack the project

```
npm run webpack
```

Run the project

```
npm start
```

## Building the app

Build the app as an executable/installer

Pack the project

```
npm run webpack
```

Build the project

```
npm run build
```

Your binaries will be in `./build`

## Running the tests

Tests are ran using jest + enzyme. To run them, simply

```
npm t
```


## Built With

* [Electron](https://electron.atom.io/) - Platform for native apps
* [React](https://facebook.github.io/react/) - UI Framework
* [Redux](http://redux.js.org/) - State management


## Authors

* **Uwe Wiemer** - [hallowatcher](https://github.com/hallowatcher)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* Guys at irc4osu
