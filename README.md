## Hello Ethereum

Ethereum API web app POC using plain node.js

### Setup

Clone source code, enter directory, install dependencies:

```
npm install
```

Create `hello1` blockchain with `genesis.json` as genesis block:

```
geth --datadir hello1 init genesis.json
```

Running `hello1` blockchain with console:

```
geth --datadir=hello1 console 2>console.log
```

### Running

Run registration POC:

> Capture email and public wallet (validation ignored), create new account and store all data as new record in memory

```
node register.js
```
