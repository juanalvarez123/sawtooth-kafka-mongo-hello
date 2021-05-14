# Sawtooth authorizations example

## Install dependencies

* [docker](https://docs.docker.com/engine/install/ubuntu/)
* [docker-compose](https://docs.docker.com/compose/install/)
* [node 10](https://nodejs.org/en/download/) ... maybe works with v12.

## Linux dependencies

```bash
./install-dependencies.sh
# Restart terminal
nvm install v10
```

## Running

### docker-compose

```bash
./init.sh
./up.sh
./down.sh
```

### Code

In `./app/` there are scripts to test sawtooth.

`tp1` has the transaction procesor (Similar to a smart contract). This transaction processor stores a value with a key like a map or hashtable.
