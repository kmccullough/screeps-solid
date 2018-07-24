# Screeps SOLID

## Setup

### Dependencies

 - [Node.JS](https://nodejs.org/en/download) (>= 8.0.0)
 - [npm](https://docs.npmjs.com/getting-started/installing-node)

```bash
npm install
```

### Upload to Screeps Server
Move or copy `screeps.sample.json` to `screeps.json` and edit it, changing the credentials and optionally adding or removing some of the destinations.

#### Important! To upload code to a private server, you must have [screepsmod-auth](https://github.com/ScreepsMods/screepsmod-auth) installed and configured!


# Dev and Deployment

#### Evaluate code with linter

```bash
npm run lint
```

#### Build TypeScript to es6 and output to dist directory

```bash
npm run build
```

#### Build and push to Screeps server

```bash
npm run push
```

#### Build and push to Screeps server, whenever code changes

```bash
npm run watch
```

#### Build and run unit tests locally

```bash
npm test
```
