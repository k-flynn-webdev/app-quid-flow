#!/bin/bash

script_location=$(dirname $0)
echo $script_location
cd $script_location
pwd
# browsrer url = 'http://127.0.0.1:8600/'

export IP="127.0.0.1"
export PORT="8600"
export HASHSECRET="SecretHere"

export DATABASEURL="mongodb://127.0.0.1/app_data"
export TOKENSECRET="LongTokenSecretHere"

# set node env to production on live server, development otherwise
export NODE_ENV="development"

node app.js

