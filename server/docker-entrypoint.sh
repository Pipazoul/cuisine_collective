#!/bin/bash
. common.sh

set -e
bash -c "export NODE_ENV='prod'; node /applis/cuisine_collective/server/auto.js migrate"
checkerror "Echec de auto.js migrate"
pm2 start /applis/cuisine_collective/server/pm2/ecosystem.config.js --env production --no-daemon
checkerror "Echec de pm2 start"
bash -c "$@"