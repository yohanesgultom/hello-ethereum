## Hello Ethereum

Ethereum API web app POC using plain node.js

### Prerequisites

* `geth` >= 1.6.7 https://github.com/ethereum/go-ethereum
* `node.js` >= 6.11.x
* `npm` >= 3.10.x

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

#### Registration

Capture email and public wallet (validation ignored), create new account and store all data as new record in memory.
Data structure:

```
{
    'email',
    'public_wallet',
    'private_wallet', // from personal.newAccount()
    'private_keystore', // keystore file for private_wallet
}
```
Command:
```
node register.js
```
