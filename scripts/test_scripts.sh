cd ~/app/test_app
git f
git co master
git merge origin/master
npm install
NODE_ENV=draco PORT=61440 node_modules/forever/bin/forever -a start --uid 'test' app.js 

