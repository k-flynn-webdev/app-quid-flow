#!/bin/bash

script_location=$(dirname $0)
echo $script_location
cd $script_location
pwd
# browsrer url = 'http://127.0.0.1:8600/'

export IP="127.0.0.1"
export PORT="8600"
export HASHSECRET="SALTY BEEF LINE TASTY"

export DATABASEURL="mongodb://127.0.0.1/app_test"
export TOKENSECRET="ReallyLongSecretForTokensGoesHere-2018-Rocks"

# export DATABASEURL="mongodb://kubedev:kubedev@ds135290.mlab.com:35290/quidflow_dat"

# set node env to production on live server, development otherwise
export NODE_ENV="test"

npm test

