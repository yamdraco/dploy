#!/bin/bash
cd ~<path of directory>
git fetch
local=`git log origin/<branch> -1 --pretty="%H"`
origin=`git log <branch> -1 --pretty="%H"`
if [ "$local" != "$origin" ]; then
  node_modules/forever/bin/forever stop dining
  git co <branch>
  git merge origin/<branch>
  npm install
  NODE_ENV=testing PORT=80 node_modules/forever/bin/forever -a start --uid 'dining' app.js #running script
fi
